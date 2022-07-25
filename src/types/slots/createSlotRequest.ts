import { RefTestType } from "../reference/product";
import { RefService } from "../reference/service";
import { RefServiceType } from "../reference/serviceType";
import { RefSlotStatus } from "../reference/slotStatus";
import { RefTestCentre } from "../reference/testCentre";

export type CreateSlotRequest = {
  SlotID: string
  StartTime: Date
  EndTime: Date
  TestType: RefTestType
  Service: RefService
  ServiceType: RefServiceType
  TestCentre: RefTestCentre
  Price: string
  Extendable: boolean
  Premium: boolean
  Status: RefSlotStatus
};
