import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { SlotResponse, SlotUpdateRequest } from '../types/slot';

@injectable()
export class UpdateSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    try {
      const { slotId } = event.pathParameters;

      this.logger.info(`Updating Slot ${slotId}`);

      if (!(await this.service.slotExistsWithId(slotId))) {
        return {
          statusCode: 404,
          body: 'Slot Not Found',
        };
      }

      const request: SlotUpdateRequest = JSON.parse(event.body) as SlotUpdateRequest;
      const response: SlotResponse = await this.service.updateSlot(request, slotId);

      this.logger.info(`Updated Slot ${slotId}`);

      return {
        statusCode: 201,
        body: JSON.stringify(response),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
