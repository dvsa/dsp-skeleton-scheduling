import { RefTestType } from "../reference/product";

export type ReserveFieldServicesSlotRequest = {
  Reserved: boolean
  SlotID: string
};

export type ReserveSlotRequest = {
  ExtendedSlot: boolean
  SpecialRequirements: string[]
  TestType: RefTestType
};
