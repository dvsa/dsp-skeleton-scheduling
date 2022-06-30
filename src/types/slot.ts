export enum ServiceType {
  Extended = 'Extended',
  Standard = 'Standard',
  ExtraTime = 'ExtraTime',
}

export enum RefServiceType {
  Standard = 1,
  Extended = 2,
  ExtraTime = 3,
}

export type BooleanString = 'true' | 'false';

export type CreateSlotRequest = {
  SlotID: string
  StartTime: Date
  EndTime: Date
  Service: string
  ServiceType: ServiceType
  TestCentre: string
  Price: string
  Available: BooleanString
};

export type GetSlotsRequest = {
  StartDate?: Date
  EndDate?: Date
  Service?: string
  ServiceType?: ServiceType
  TestCentre?: string
};

export type SlotResponse = CreateSlotRequest;

export type Slot = {
  slot_id: string
  start_time: Date
  end_time: Date
  service: string
  service_type_id: RefServiceType
  test_centre: string
  price: string
  available: boolean
};

export type SlotUpdateRequest = Partial<Omit<CreateSlotRequest, 'SlotID'>>;
export type SlotUpdateData = Partial<Omit<Slot, 'slot_id'>>;
