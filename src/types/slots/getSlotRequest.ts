import { RefTestType } from "../reference/product";
import { RefServiceType } from "../reference/serviceType";
import { RefTestCentre } from "../reference/testCentre";

export type GetSlotsRequest = {
  StartDate?: Date
  EndDate?: Date
  Product?: RefTestType
  ServiceType?: RefServiceType
  TestCentre?: RefTestCentre
  SpecialAccommodations?: boolean
  ExtraTime?: boolean
  Extended?: boolean
};
