import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { CreateSlotRequest } from '../types/slots/createSlotRequest';
import { SlotResponse } from '../types/slots/slotResponse';

@injectable()
export class CreateSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    const request: CreateSlotRequest = <CreateSlotRequest>JSON.parse(event.body);
    try {
      this.logger.info('creating slot', request);

      const slot: SlotResponse = await this.service.createOrUpdateSlot(request);

      this.logger.info('successfully created slot', slot);

      return {
        statusCode: 201,
        body: JSON.stringify(slot),
      };
    } catch (error) {
      this.logger.error('Crash bang', error);
      this.logger.error('Error - Request', request);
      throw error
    }
  }
}
