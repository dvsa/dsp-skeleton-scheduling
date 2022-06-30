import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { CreateSlotRequest, SlotResponse } from '../types/slot';

@injectable()
export class CreateSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    try {
      const request: CreateSlotRequest = <CreateSlotRequest>JSON.parse(event.body);

      this.logger.info('creating slot', request);

      const slot: SlotResponse = await this.service.createOrUpdateSlot(request);

      return {
        statusCode: 201,
        body: JSON.stringify(slot),
      };
    } catch (error) {
      this.logger.error('Crash bang', error);
      throw error;
    }
  }
}
