import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { LambdaHandler } from './lambdaHandler';
import { types } from '../ioc/types';
import { SlotService } from '../services/slots/slotService';
import { SlotResponse } from '../types/slots/slotResponse';
import { BookSlotConstraintTester } from '../services/slots/bookSlotConstraintTester';
import { StatusCodes } from 'http-status-codes';
import { ReserveSlotRequest } from '../types/slots/reserveSlotRequest';

@injectable()
export class ReserveSlot implements LambdaHandler {
  constructor(
    @inject(types.logger) private logger: Logger,
    @inject(types.SlotService) private service: SlotService,
    @inject(types.BookSlotConstraintTester) private constraintTester: BookSlotConstraintTester,
  ) { }

  async handler(event: APIGatewayProxyEvent, _: Context): Promise<APIGatewayProxyResult> {
    try {
      this.logger.info('Reserving Slot - path params', event.pathParameters);

      const { slotId } = event.pathParameters;

      if (!(await this.service.slotExistsWithId(slotId))) {
        return {
          statusCode: StatusCodes.NOT_FOUND,
          body: 'Slot Not Found',
        };
      }

      const request: ReserveSlotRequest = <ReserveSlotRequest>JSON.parse(event.body);
      const errors: string = await this.constraintTester.checkReserveSlotConstraints(slotId, request)

      if (errors) {
        return {
          statusCode: StatusCodes.PRECONDITION_FAILED,
          body: errors,
        };
      }

      this.logger.info(`Reserving Slot ${slotId}`);

      const response: SlotResponse = await this.service.reserveSlot(slotId);

      this.logger.info(`Reserved Slot ${slotId}`);

      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(response),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
