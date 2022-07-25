import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { BookSlotConstraintTester } from '../services/slots/bookSlotConstraintTester';
import { StatusCodes } from 'http-status-codes';
import { BookSlotRequest } from '../types/slots/bookSlotRequest';
import { SlotResponse } from '../types/slots/slotResponse';

@injectable()
export class BookSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
    @inject(types.BookSlotConstraintTester) private constraintTester: BookSlotConstraintTester,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    const request: BookSlotRequest = <BookSlotRequest>JSON.parse(event.body);

    try {
      this.logger.info('Booking Slot - path params', event.pathParameters);

      const { slotId } = event.pathParameters;

      if (!(await this.service.slotExistsWithId(slotId))) {
        return {
          statusCode: StatusCodes.NOT_FOUND,
          body: 'Slot Not Found',
        };
      }

      const errors: string = await this.constraintTester.checkBookSlotConstraints(slotId, request)

      if (errors) {
        return {
          statusCode: StatusCodes.PRECONDITION_FAILED,
          body: errors,
        };
      }

      this.logger.info(`Booking Slot ${slotId}`);

      const response: SlotResponse = await this.service.bookSlot(slotId, request);

      this.logger.info(`Reserved Slot ${slotId}`);

      return {
        statusCode: 201,
        body: JSON.stringify(response),
      };
    } catch (error) {
      this.logger.error('Error booking slot - ', error, request);
      throw error;
    }
  }
}
