import 'dotenv/config';
import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { CreateSlot } from '../apps/createSlot';
import { container } from '../ioc/container';
import { types } from '../ioc/types';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const slotSync: CreateSlot = container.get<CreateSlot>(types.CreateSlot);

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => slotSync.handler(event, context);
