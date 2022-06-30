import 'dotenv/config';
import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { container } from '../ioc/container';
import { types } from '../ioc/types';
import { GetSlots } from '../apps/getSlots';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const getSlot: GetSlots = container.get<GetSlots>(types.GetSlots);

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => getSlot.handler(event, context);
