const types = {
  logger: Symbol.for('logger'),

  CreateSlot: Symbol.for('CreateSlot'),
  UpdateSlot: Symbol.for('UpdateSlot'),
  GetSlots: Symbol.for('GetSlots'),

  requestToSlotMapper: Symbol.for('requestToSlotMapper'),

  SlotsDbConfig: Symbol.for('SlotsDbConfig'),
  SlotsDbService: Symbol.for('SlotsDbService'),
  RDSSigner: Symbol.for('RDSSigner'),
  RDSService: Symbol.for('RDSService'),

  SlotService: Symbol.for('SlotService'),
};

export { types };
