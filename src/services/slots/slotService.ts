/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { Slot, SlotUpdateData } from '../../types/slots/slot';
import { Service } from '../../types/reference/service';
import { types } from '../../ioc/types';
import { RequestToSlotMapper } from '../../mappers/requestToSlotMapper';
import { SlotsDBService } from '../db/slotsDBService';
import { DynamicsService } from '../dynamics/dynamicsService';
import { CreateSlotRequest } from '../../types/slots/createSlotRequest';
import { GetSlotsRequest } from '../../types/slots/getSlotRequest';
import { BookSlotRequest } from '../../types/slots/bookSlotRequest';
import { SlotResponse } from '../../types/slots/slotResponse';
import { RefSlotStatus } from '../../types/reference/slotStatus';
import { ServiceLookup } from './serviceLookup';
import { RefService } from '../../types/reference/service';

@injectable()
export class SlotService {
  constructor(
    @inject(types.requestToSlotMapper) private mapper: RequestToSlotMapper,
    @inject(types.SlotsDBService) private dbService: SlotsDBService,
    @inject(types.DynamicsService) private dynamicsService: DynamicsService,
    @inject(types.ServiceLookup) private serviceLookup: ServiceLookup,
    @inject(types.logger) private logger: Logger,
  ) { }

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

    await this.dbService.insert(slot);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async updateSlot(request: CreateSlotRequest, slotId: string): Promise<SlotResponse> {
    const slotUpdateData: SlotUpdateData = this.mapper.mapToSlotUpdateData(request);

    this.logger.info('slot update data', slotUpdateData);

    await this.dbService.update(slotUpdateData, slotId);

    const slot: Slot = await this.dbService.getWithId(slotId);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async reserveSlot(slotId: string): Promise<SlotResponse> {
    this.logger.info('Reserving slot');

    await this.dynamicsService.reserveSlot(slotId)
    await this.dbService.update({ slot_status_id: RefSlotStatus.booked_provisional }, slotId);

    const slot: Slot = await this.dbService.getWithId(slotId);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async bookSlot(slotId: string, request: BookSlotRequest): Promise<SlotResponse> {
    this.logger.info('Booking slot');

    const slot: Slot = await this.dbService.getWithId(slotId);

    const specialAccommodations: boolean = request.SpecialRequirements.length > 0
    const extraTime: boolean = this.serviceLookup.requiresExtraTime(request.SpecialRequirements)
    const service: RefService = this.serviceLookup.getRequiredService(request.TestType, request.ExtendedSlot, specialAccommodations, extraTime, slot.premium)

    await this.dynamicsService.bookSlot(slotId, service, request)

    await this.dbService.update({ slot_status_id: RefSlotStatus.booked }, slotId);
    slot.slot_status_id = RefSlotStatus.booked

    return this.mapper.mapToSlotResponse(slot);
  }

  public async slotExistsWithId(slotId: string): Promise<boolean> {
    return !!(await this.dbService.getWithId(slotId));
  }

  public async getSlot(slotId: string): Promise<SlotResponse> {
    this.logger.info('slotId', slotId);

    const slot: Slot = await this.dbService.getWithId(slotId);

    this.logger.info('slot?', slot);

    return this.mapper.mapToSlotResponse(slot);
  }

  public async getSlots(queryParams: APIGatewayProxyEventQueryStringParameters): Promise<SlotResponse[]> {
    const request: GetSlotsRequest = this.mapper.mapToGetSlotsRequest(queryParams);

    this.logger.info('request', request);

    const slots: Slot[] = await this.dbService.get(request);

    const services: Service[] = await this.dbService.getServices()

    this.logger.info('slots?', slots);
    this.logger.info('services?', services);

    return slots.map((slot) => {
      const requiredService: RefService = this.serviceLookup.getRequiredService(slot.test_type_id, request.Extended, request.SpecialAccommodations, request.ExtraTime, slot.premium)
      const service = services.find((service) => service.service_id === requiredService)
      return this.mapper.mapToSlotResponseFromService(slot, service)
    })
  }
}
