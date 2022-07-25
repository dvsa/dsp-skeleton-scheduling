import { ScheduledEvent } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { types } from '../../ioc/types';
import { ReleaseSlotsService } from '../../services/slots/releaseSlotsService';

@injectable()
export class ReleaseSlotsJob {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.ReleaseSlotsService) private service: ReleaseSlotsService,
  ) { }

  async handler(event: ScheduledEvent): Promise<void> {
    try {
      this.logger.info('Starting release slots job');

      await this.service.releaseSlots();

      this.logger.info('finished');

    } catch (error) {
      this.logger.error('Crash bang - error releasing slots' , error);
      throw error
    }
  }
}
