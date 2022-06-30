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
import { SlotsDBService } from '../services/db/slotsDbService';
import { RDSService } from '../services/aws/rdsService';
import { SlotService } from '../services/slots/slotService';
import { UpdateSlot } from '../apps/updateSlot';
import { GetSlots } from '../apps/getSlots';

const container: Container = new Container();

// Apps
container.bind<CreateSlot>(types.CreateSlot).to(CreateSlot);
container.bind<UpdateSlot>(types.UpdateSlot).to(UpdateSlot);
container.bind<GetSlots>(types.GetSlots).to(GetSlots);

// Mappers
container.bind<RequestToSlotMapper>(types.requestToSlotMapper).to(RequestToSlotMapper);

// DB
container.bind<SlotsDBService>(types.SlotsDbService).to(SlotsDBService).inSingletonScope();
container.bind<RDS.Signer>(types.RDSSigner).toConstantValue(new RDS.Signer({
  region: AWS_REGION,
  hostname: SLOTS_HOST,
  port: SLOTS_PORT,
  username: SLOTS_USERNAME,
}));
container.bind<RDSService>(types.RDSService).to(RDSService);

// Services
container.bind<SlotService>(types.SlotService).to(SlotService);

// Utils
container.bind<Logger>(types.logger).toConstantValue(logger);

export { container };
