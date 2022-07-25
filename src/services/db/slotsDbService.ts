/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Knex } from 'knex';
import { Slot, SlotUpdateData } from '../../types/slots/slot';
import { Service } from '../../types/reference/service';
import { types } from '../../ioc/types';
import { SlotsConnectionService } from './slotsConnectionService';
import { GetSlotsRequest } from '../../types/slots/getSlotRequest';
import { RefTestType } from '../../types/reference/product';
import { RefSlotStatus } from '../../types/reference/slotStatus';
import { RefTestCentre, TestCentre } from '../../types/reference/testCentre';
import { endOfDay, startOfDay } from '../../helpers/dateHelpers';
import { RefServiceType } from '../../types/reference/serviceType';

@injectable()
export class SlotsDBService {
  constructor(
    @inject(types.SlotsConnectionService) private dbService: SlotsConnectionService,
  ) { }


  public async insert(slot: Slot): Promise<void> {
    const knex: Knex = await this.dbService.knex();
    const trx: Knex.Transaction = await this.getTransaction(knex);

    try {
      await knex('slot').insert(slot).transacting(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  public async get(request: GetSlotsRequest): Promise<Slot[]> {
    const knex: Knex = await this.dbService.knex();
    const qb: Knex.QueryBuilder = knex<Slot, Slot[]>('slot')
      .where('released', true)
      .andWhere('slot_status_id', RefSlotStatus.open);

    this.filterSlots(request, qb);

    return qb.orderBy('start_time', 'asc').select();
  }

  public async update(slot: SlotUpdateData, slotId: string): Promise<void> {
    const knex: Knex = await this.dbService.knex();
    const trx: Knex.Transaction = await this.getTransaction(knex);

    await knex('slot').update(slot).where('slot_id', slotId).transacting(trx);

    await trx.commit();
  }

  public async releaseSlots(testType: RefTestType, startDate: Date, endDate: Date): Promise<string[]> {
    const knex: Knex = await this.dbService.knex();
    const trx: Knex.Transaction = await this.getTransaction(knex);

    try {
      const slotIds: string[] = await knex('slot').update({ released: true })
        .where('product_id', testType)
        .andWhere('end_time', '<=', endDate)
        .andWhere('start_time', '>=', startDate)
        .returning('slot_id')
        .transacting(trx);

      await trx.commit();

      return slotIds
    } catch (error) {
      trx.rollback()
      throw error
    }
  }

  public async getWithId(slotId: string): Promise<Slot> {
    const knex: Knex = await this.dbService.knex();
    return knex<Slot, Slot>('slot').select().where('slot_id', slotId).first();
  }

  public async countBookedExtendedTestSlots(testDate: Date, testCentre: RefTestCentre): Promise<number> {
    const knex: Knex = await this.dbService.knex();

    const query: Knex.QueryBuilder = knex('slot')
      .count('slot_id')
      .whereIn('slot_status_id', [RefSlotStatus.booked, RefSlotStatus.booked_provisional])
      .andWhere('start_time', '>=', startOfDay(testDate))
      .andWhere('start_time', '<=', endOfDay(testDate))
      .andWhere('test_centre_id', testCentre)
      .andWhere('service_type_id', RefServiceType.extended)
      .first();

    const result = await query

    console.log(query.toSQL())

    return Number(result.count)
  }

  public async countBookedExtraTimeSlots(testDate: Date, testCentre: RefTestCentre): Promise<number> {
    const knex: Knex = await this.dbService.knex();

    const query: Knex.QueryBuilder = knex('slot')
      .count('slot_id')
      .whereIn('slot_status_id', [RefSlotStatus.booked, RefSlotStatus.booked_provisional])
      .andWhere('start_time', '>=', startOfDay(testDate))
      .andWhere('start_time', '<=', endOfDay(testDate))
      .andWhere('test_centre_id', testCentre)
      .andWhere('service_type_id', RefServiceType.extra_time)
      .first();

    const result = await query

    console.log(query.toSQL())

    return Number(result.count)
  }

  public async getTestCentre(testCentre: RefTestCentre): Promise<TestCentre> {
    const knex: Knex = await this.dbService.knex();

    return knex<TestCentre, TestCentre>('test_centre')
      .select()
      .where('test_centre_id', testCentre)
      .first()
  }

  public async getServices(): Promise<Service[]> {
    const knex: Knex = await this.dbService.knex();

    return knex<Service, Service[]>('service').select()
  }

  private filterSlots(request: GetSlotsRequest, qb: Knex.QueryBuilder) {
    if (request.EndDate) {
      qb.where('end_time', '<=', request.EndDate);
    }

    if (request.StartDate) {
      qb.where('start_time', '>=', request.StartDate);
    }

    if (request.Product) {
      qb.where('product_id', request.Product);
    }

    if (request.ServiceType) {
      qb.where('service_type_id', request.ServiceType);
    }

    if (request.TestCentre) {
      qb.where('test_centre_id', request.TestCentre);
    }

    if (request.ExtraTime || request.Extended) {
      qb.where('extendable', true);
    }
  }

  private getTransaction(connection: Knex): Promise<Knex.Transaction> {
    return new Promise<Knex.Transaction>((resolve, reject) => {
      connection.transaction((trx: Knex.Transaction) => resolve(trx)).catch(((error) => reject(error)));
    });
  }
}
