/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { types } from '../../ioc/types';
import { RefTestType } from '../../types/reference/product';
import { SlotsDBService } from '../db/slotsDBService';
import { ReleaseWindowCalculator } from '../releaseWindowCalculator';

@injectable()
export class ReleaseSlotsService {
  constructor(
    @inject(types.SlotsDBService) private dbService: SlotsDBService,
    @inject(types.logger) private logger: Logger,
    @inject(types.ReleaseWindowCalculator) private releaseWindowCalculator: ReleaseWindowCalculator,
  ) { }

  public async releaseSlots(): Promise<void> {
    this.logger.info('releasing car slots')
    await this.release(RefTestType.car)

    this.logger.info('releasing lorry slots')
    await this.release(RefTestType.lorry)
  }

  private async release(testType: RefTestType): Promise<void> {
    const startDate: Date = this.releaseWindowCalculator.getReleaseWeekStartDate(testType, new Date())
    const endDate: Date = this.releaseWindowCalculator.getWeekEndDate(startDate)
    this.logger.info(`releasing slots for the week ${startDate} to ${endDate}`)
    const slotIds: string[] = await this.dbService.releaseSlots(testType, startDate, endDate)
    this.logger.info(`released ${slotIds.length} slots`, slotIds)
  }
}
