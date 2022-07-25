import { APIGatewayProxyEvent, Context, APIGatewayProxyResult, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { SlotResponse } from '../types/slots/slotResponse';

@injectable()
export class GetSlots implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    try {
      this.logger.info('Retrieving Slots');

      const requestParams: APIGatewayProxyEventQueryStringParameters = event.queryStringParameters;

      this.logger.info('request params');
      this.logger.info(requestParams);

      const slots: SlotResponse[] = await this.service.getSlots(requestParams);

      this.logger.info('Retrieved Slots');

      return {
        statusCode: 201,
        body: JSON.stringify(slots),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
