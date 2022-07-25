import { RefTestType } from '../reference/product';
import { RefService } from '../reference/service';
import { RefServiceType } from '../reference/serviceType';
import { RefSlotStatus } from '../reference/slotStatus';
import { RefTestCentre } from '../reference/testCentre';

export type Slot = {
  slot_id: string
  start_time: Date
  end_time: Date
  test_type_id: RefTestType
  service_id: RefService
  service_type_id: RefServiceType
  test_centre_id: RefTestCentre
  price: string
  extendable: boolean
  released: boolean
  slot_status_id: RefSlotStatus
  premium: boolean
};

export type SlotUpdateData = Partial<Omit<Slot, 'slot_id'>>;
