/* eslint-disable @typescript-eslint/no-floating-promises */
import { injectable } from 'inversify';
import { getStartOfWeek, addWeeksToDate, addDaysToDate } from '../helpers/dateHelpers';
import { RefTestType } from '../types/reference/product';

@injectable()
export class ReleaseWindowCalculator {
  CAR_ROLLING_WINDOW: number
  LORRY_ROLLING_WINDOW: number

  constructor() {
    this.CAR_ROLLING_WINDOW = Number(process.env.CAR_ROLLING_WINDOW);
    this.LORRY_ROLLING_WINDOW = Number(process.env.LORRY_ROLLING_WINDOW);
  }
  
  public getReleaseWeekStartDate(testType: RefTestType, from: Date): Date {
    switch (testType) {
      case RefTestType.car:
        return this.calculateReleaseWeekStartDate(this.CAR_ROLLING_WINDOW, from)
      case RefTestType.lorry:
        return this.calculateReleaseWeekStartDate(this.LORRY_ROLLING_WINDOW, from)
    }
  }

  public isReleased(testType: RefTestType, testStartDate: Date, from: Date) {
    const releaseWeekStart: Date = this.getReleaseWeekStartDate(testType, from)

    return testStartDate < releaseWeekStart
  }

  public getWeekEndDate(startDate: Date): Date {
    const end: Date = addDaysToDate(startDate, 6)
    end.setUTCHours(23, 59, 59, 999)
    return end
  }

  private calculateReleaseWeekStartDate(weeksToAdd: number, from: Date): Date {
    let start: Date = new Date(from)

    start = addWeeksToDate(start, weeksToAdd)
    start = getStartOfWeek(start)
    start.setUTCHours(0, 0, 0, 0)

    return start
  }
}
