import { RefTestType } from '../reference/product';
import { RefServiceType } from '../reference/serviceType';
import { RefSlotStatus } from '../reference/slotStatus';
import { RefTestCentre } from '../reference/testCentre';

export type SlotResponse = {
  SlotID: string
  StartTime: Date
  EndTime: Date
  TestType: RefTestType
  ServiceType: RefServiceType
  TestCentre: RefTestCentre
  Price: number
  Released: boolean
  Extendable: boolean
  Status: RefSlotStatus
};
