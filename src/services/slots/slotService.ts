/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import {
  Slot, CreateSlotRequest, SlotResponse, SlotUpdateData, SlotUpdateRequest, GetSlotsRequest, RefServiceType,
} from '../../types/slot';
import { types } from '../../ioc/types';
import { RequestToSlotMapper } from '../../mappers/requestToSlotMapper';
import { SlotsDBService } from '../db/slotsDbService';

@injectable()
export class SlotService {
  constructor(
    @inject(types.requestToSlotMapper) private mapper: RequestToSlotMapper,
    @inject(types.SlotsDbService) private dbService: SlotsDBService,
    @inject(types.logger) private logger: Logger,
  ) {}

  public async createOrUpdateSlot(request: CreateSlotRequest): Promise<SlotResponse> {
    if (await this.slotExistsWithId(request.SlotID)) {
      this.logger.info('slot did exist, updating');
      return this.updateSlot(request, request.SlotID);
    }

    this.logger.info('slot did not exist, creating');
    return this.createSlot(request);
  }

  public async createSlot(body: CreateSlotRequest): Promise<SlotResponse> {
    const slot: Slot = this.mapper.mapToSlot(body);

    this.logger.info('slot to insert', slot);

    await this.writeSlotToDB(slot);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async updateSlot(request: CreateSlotRequest | SlotUpdateRequest, slotId: string): Promise<SlotResponse> {
    const slotUpdateData: SlotUpdateData = this.mapper.mapToSlotUpdateData(request);

    this.logger.info('slot to update', slotUpdateData);

    await this.updateSlotInDb(slotUpdateData, slotId);

    const slot: Slot = await this.getSlotWithId(slotId);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async slotExistsWithId(slotId: string): Promise<boolean> {
    return !!(await this.getSlotWithId(slotId));
  }

  public async getSlots(queryParams: APIGatewayProxyEventQueryStringParameters): Promise<SlotResponse[]> {
    const request: GetSlotsRequest = this.mapper.mapToGetSlotsRequest(queryParams);

    this.logger.info('request');
    this.logger.info(request);

    const slots: Slot[] = await this.getSlotsFromDb(request);

    this.logger.info('slots?');
    this.logger.info(slots);

    return slots.map((slot) => this.mapper.mapToSlotResponse(slot));
  }

  private async writeSlotToDB(slot: Slot): Promise<void> {
    const knex: Knex = await this.dbService.knex();
    const trx: Knex.Transaction = await this.getTransaction(knex);

    try {
      await knex('slot').insert(slot).transacting(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
    }
  }

  private async updateSlotInDb(slot: SlotUpdateData, slotId: string): Promise<void> {
    const knex: Knex = await this.dbService.knex();
    const trx: Knex.Transaction = await this.getTransaction(knex);

    await knex('slot').update(slot).where('slot_id', slotId).transacting(trx);

    await trx.commit();
  }

  private async getSlotWithId(slotId: string): Promise<Slot> {
    const knex: Knex = await this.dbService.knex();
    return knex<Slot, Slot>('slot').select().where('slot_id', slotId).first();
  }

  private async getSlotsFromDb(request: GetSlotsRequest): Promise<Slot[]> {
    const knex: Knex = await this.dbService.knex();
    const qb: Knex.QueryBuilder = knex<Slot, Slot[]>('slot');

    this.filterSlots(request, qb);

    this.logger.info(qb.where('available', true).select().toQuery());

    return qb.where('available', true).select();
  }

  private filterSlots(request: GetSlotsRequest, qb: Knex.QueryBuilder) {
    if (request.EndDate) {
      qb.where('end_time', '<=', request.EndDate);
    }

    if (request.StartDate) {
      qb.where('start_time', '>=', request.StartDate);
    }

    if (request.Service) {
      qb.where('service', 'like', `%${request.Service}%`);
    }

    if (request.ServiceType) {
      qb.where('service_type_id', RefServiceType[request.ServiceType]);
    }

    if (request.TestCentre) {
      qb.where('test_centre', 'like', `%${request.TestCentre}%`);
    }
  }

  private getTransaction(connection: Knex): Promise<Knex.Transaction> {
    return new Promise<Knex.Transaction>((resolve, reject) => {
      connection.transaction((trx: Knex.Transaction) => resolve(trx)).catch(((error) => reject(error)));
    });
  }
}
