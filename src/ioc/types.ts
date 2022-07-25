const types = {
  logger: Symbol.for('logger'),

  BookSlot: Symbol.for('BookSlot'),
  CreateSlot: Symbol.for('CreateSlot'),
  ReserveSlot: Symbol.for('ReserveSlot'),
  GetSlots: Symbol.for('GetSlots'),
  GetSlot: Symbol.for('GetSlot'),

  ReleaseSlotsJob: Symbol.for('ReleaseSlotsJob'),

  requestToSlotMapper: Symbol.for('requestToSlotMapper'),

  SlotsDbConfig: Symbol.for('SlotsDbConfig'),
  SlotsConnectionService: Symbol.for('SlotsConnectionService'),
  SlotsDBService: Symbol.for('SlotsDBService'),
  RDSSigner: Symbol.for('RDSSigner'),
  RDSService: Symbol.for('RDSService'),

  SlotService: Symbol.for('SlotService'),
  BookSlotConstraintTester: Symbol.for('BookSlotConstraintTester'),
  ReleaseSlotsService: Symbol.for('ReleaseSlotsService'),
  ServiceLookup: Symbol.for('ServiceLookup'),

  ReleaseWindowCalculator: Symbol.for('ReleaseWindowCalculator'),

  DynamicsService: Symbol.for('DynamicsService'),
  DynamicsClient: Symbol.for('DynamicsClient'),
};

export { types };
