/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { Slot } from '../../types/slots/slot';
import { types } from '../../ioc/types';
import { SlotsDBService } from '../db/slotsDBService';
import { RefSlotStatus } from '../../types/reference/slotStatus';
import { TestCentre } from '../../types/reference/testCentre';
import { BookSlotRequest } from '../../types/slots/bookSlotRequest';
import { ReserveSlotRequest } from '../../types/slots/reserveSlotRequest';

@injectable()
export class BookSlotConstraintTester {
  constructor(
    @inject(types.SlotsDBService) private dbService: SlotsDBService,
    @inject(types.logger) private logger: Logger,
  ) { }

  public async checkReserveSlotConstraints(slotId: string, request: ReserveSlotRequest): Promise<string> {
    const slot: Slot = await this.dbService.getWithId(slotId)

    if (!slot.released) {
      return 'This slot is not released'
    }

    if (slot.slot_status_id !== RefSlotStatus.open) {
      this.logger.info('This slot is not available to book', slot.slot_status_id);
      return 'This slot did not have open status'
    }

    return this.checkExtraTimeSlotCapacityConstraint(request, slot)
  }

  public async checkBookSlotConstraints(slotId: string, request: BookSlotRequest): Promise<string> {
    const slot: Slot = await this.dbService.getWithId(slotId)

    if (!slot.released) {
      return 'This slot is not released'
    }

    if (slot.slot_status_id !== RefSlotStatus.booked_provisional) {
      this.logger.info('This slot is not available to book', slot.slot_status_id);
      return 'This slot did not have open status'
    }

    return this.checkExtraTimeSlotCapacityConstraint(request, slot)

  }

  private async checkExtraTimeSlotCapacityConstraint(request: BookSlotRequest | ReserveSlotRequest, slot: Slot): Promise<string> {
    const testCentre: TestCentre = await this.dbService.getTestCentre(slot.test_centre_id)
    console.log(testCentre)

    if (request.SpecialRequirements?.length > 0) {
      const bookedExtraTimeTestCount: number = await this.dbService.countBookedExtraTimeSlots(slot.start_time, slot.test_centre_id)
      return bookedExtraTimeTestCount < testCentre.special_accommodation_slots_per_day ? null : 'Test Centre has no further Extra Time capacity'
    }

    if (request.ExtendedSlot) {
      const bookedExtraTimeTestCount: number = await this.dbService.countBookedExtendedTestSlots(slot.start_time, slot.test_centre_id)
      return bookedExtraTimeTestCount < testCentre.extended_tests_slots_per_day ? null : 'Test Centre has no further Extended capacity today'
    }
  }
}
