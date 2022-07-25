/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { types } from '../../ioc/types';
import { DynamicsClient } from '../../client/dynamicsClient';
import { BookFieldServiceSlotRequest, BookSlotRequest } from '../../types/slots/bookSlotRequest';
import { RefService } from '../../types/reference/service';

@injectable()
export class DynamicsService {
  constructor(
    @inject(types.DynamicsClient) private client: DynamicsClient,
    @inject(types.logger) private logger: Logger,
  ) { }

  public async reserveSlot(slotId: string): Promise<void> {
    this.logger.info('Reserving slot - dynamics service');

    await this.client.reserveSlot({
      SlotID: slotId,
      Reserved: true
    })
  }

  public async bookSlot(slotId: string, service: RefService, bookSlotRequest: BookSlotRequest): Promise<void> {
    const fsBookSlotRequest: BookFieldServiceSlotRequest = {
      SlotID: slotId,
      ServiceType: service,
      FirstName: bookSlotRequest.FirstName,
      Surname: bookSlotRequest.Surname,
      TelephoneNumber: bookSlotRequest.TelephoneNumber,
      EmailAddress: bookSlotRequest.EmailAddress
    }

    this.logger.info('Booking slot - dynamics service', fsBookSlotRequest);

    await this.client.bookSlot(fsBookSlotRequest)
  }
}
