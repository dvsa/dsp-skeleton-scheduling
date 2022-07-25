import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { SlotResponse } from '../types/slots/slotResponse';

@injectable()
export class GetSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    try {
      this.logger.info('Retrieving Slot - path params', event.pathParameters);

      const slotId: string = event.pathParameters['slotId'];

      this.logger.info('slotId', slotId);

      const slot: SlotResponse = await this.service.getSlot(slotId);

      this.logger.info('Retrieved Slots');

      return {
        statusCode: 201,
        body: JSON.stringify(slot),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
