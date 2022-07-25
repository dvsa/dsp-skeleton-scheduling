import { RefTestType } from "../reference/product";
import { RefService } from "../reference/service";

export type BookFieldServiceSlotRequest = {
  SlotID: string
  ServiceType: RefService
  FirstName: string
  Surname: String
  TelephoneNumber: string
  EmailAddress: string
};

export type BookSlotRequest = {
  ExtendedSlot: boolean
  SpecialRequirements: string[]
  TestType: RefTestType
  FirstName: string
  Surname: String
  TelephoneNumber: string
  EmailAddress: string
};

