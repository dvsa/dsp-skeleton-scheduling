/* eslint-disable @typescript-eslint/no-floating-promises */
import { injectable } from 'inversify';
import { RefTestType } from '../../types/reference/product';
import { RefService } from '../../types/reference/service';
import { SpecialAccommodations } from '../../types/reference/specialAccommodations';

@injectable()
export class ServiceLookup {

  public getRequiredService(testType: RefTestType, extended: boolean, specialAccommodations: boolean, extraTime: boolean, isPremium: boolean): RefService {
    switch (testType) {
      case RefTestType.car:
        return this.getCarService(extended, specialAccommodations, extraTime, isPremium)
      case RefTestType.lorry:
        return this.getLorryService(extended, specialAccommodations, isPremium)
      default:
        throw new Error('Unsupported Test Type')
    }
  }

  private getLorryService(extended: boolean, specialAccommodations: boolean, isPremiumSlot: boolean): RefService {
    if (extended || specialAccommodations) {
      return isPremiumSlot ? RefService.special_large_goods_premium : RefService.special_large_goods_standard
    }

    return isPremiumSlot ? RefService.large_goods_premium : RefService.large_goods_standard
  }

  private getCarService(extended: boolean, specialAccommodations: boolean, extraTime: boolean, isPremiumSlot: boolean): RefService {
    if (extended) {
      return this.getExtendedCarService(specialAccommodations, extraTime, isPremiumSlot)
    }

    if (specialAccommodations) {
      return this.getSpecialAccommodationsCarService(extraTime, isPremiumSlot)
    }

    return isPremiumSlot ? RefService.car_premium : RefService.car_standard
  }

  private getExtendedCarService(specialAccommodations: boolean, extraTime: boolean, premiumSlot: boolean): RefService {
    if (specialAccommodations) {
      if (extraTime) {
        return premiumSlot ? RefService.special_extra_time_extended_car_premium : RefService.special_extra_time_extended_car_standard
      }

      return premiumSlot ? RefService.special_extended_car_premium : RefService.special_extended_car_standard
    }

    return premiumSlot ? RefService.extended_car_premium : RefService.extended_car_standard
  }

  private getSpecialAccommodationsCarService(extraTime: boolean, premiumSlot: boolean): RefService {
    if (extraTime) {
      return premiumSlot ? RefService.special_extra_time_car_premium : RefService.special_extra_time_car_standard
    }

    return premiumSlot ? RefService.special_car_premium : RefService.special_car_standard
  }

  public requiresExtraTime(specialAccommodations: string[]): boolean {
    return specialAccommodations.includes(SpecialAccommodations.missing_limbs)
  }
}
