import 'dotenv/config';
import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { container } from '../ioc/container';
import { types } from '../ioc/types';
import { ReserveSlot } from '../apps/reserveSlot';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const reserveSlotApp: ReserveSlot = container.get<ReserveSlot>(types.ReserveSlot);

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => reserveSlotApp.handler(event, context);
