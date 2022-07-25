import { RDS } from 'aws-sdk';
import { Container } from 'inversify';
import { Logger } from 'winston';
import { CreateSlot } from '../apps/createSlot';
import { RequestToSlotMapper } from '../mappers/requestToSlotMapper';
import logger from '../util/logger';
import { types } from './types';
import {
  SLOTS_HOST, SLOTS_USERNAME, SLOTS_PORT, AWS_REGION,
} from '../config';
import { SlotsConnectionService } from '../services/db/slotsConnectionService';
import { RDSService } from '../services/aws/rdsService';
import { SlotService } from '../services/slots/slotService';
import { ReserveSlot } from '../apps/reserveSlot';
import { GetSlots } from '../apps/getSlots';
import { SlotsDBService } from '../services/db/slotsDBService';
import { GetSlot } from '../apps/getSlot';
import { DynamicsService } from '../services/dynamics/dynamicsService';
import { DynamicsClient } from '../client/dynamicsClient';
import { BookSlotConstraintTester } from '../services/slots/bookSlotConstraintTester';
import { BookSlot } from '../apps/bookSlot';
import { ReleaseSlotsJob } from '../apps/jobs/releaseSlotsJob';
import { ReleaseSlotsService } from '../services/slots/releaseSlotsService';
import { ReleaseWindowCalculator } from '../services/releaseWindowCalculator';
import { ServiceLookup } from '../services/slots/serviceLookup';

const container: Container = new Container();

// Apps
container.bind<BookSlot>(types.BookSlot).to(BookSlot);
container.bind<CreateSlot>(types.CreateSlot).to(CreateSlot);
container.bind<ReserveSlot>(types.ReserveSlot).to(ReserveSlot);
container.bind<GetSlots>(types.GetSlots).to(GetSlots);
container.bind<GetSlot>(types.GetSlot).to(GetSlot);

// Jobs
container.bind<ReleaseSlotsJob>(types.ReleaseSlotsJob).to(ReleaseSlotsJob);

// Mappers
container.bind<RequestToSlotMapper>(types.requestToSlotMapper).to(RequestToSlotMapper);

// DB
container.bind<SlotsConnectionService>(types.SlotsConnectionService).to(SlotsConnectionService).inSingletonScope();
container.bind<SlotsDBService>(types.SlotsDBService).to(SlotsDBService).inSingletonScope();
container.bind<RDS.Signer>(types.RDSSigner).toConstantValue(new RDS.Signer({
  region: AWS_REGION,
  hostname: SLOTS_HOST,
  port: SLOTS_PORT,
  username: SLOTS_USERNAME,
}));
container.bind<RDSService>(types.RDSService).to(RDSService);

// Services
container.bind<SlotService>(types.SlotService).to(SlotService);
container.bind<BookSlotConstraintTester>(types.BookSlotConstraintTester).to(BookSlotConstraintTester);
container.bind<ReleaseSlotsService>(types.ReleaseSlotsService).to(ReleaseSlotsService);
container.bind<ServiceLookup>(types.ServiceLookup).to(ServiceLookup);

container.bind<ReleaseWindowCalculator>(types.ReleaseWindowCalculator).to(ReleaseWindowCalculator);

container.bind<DynamicsService>(types.DynamicsService).to(DynamicsService);
container.bind<DynamicsClient>(types.DynamicsClient).to(DynamicsClient);

// Utils
container.bind<Logger>(types.logger).toConstantValue(logger);

export { container };
