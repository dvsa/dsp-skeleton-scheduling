import 'dotenv/config';
import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { container } from '../ioc/container';
import { types } from '../ioc/types';
import { UpdateSlot } from '../apps/updateSlot';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const updateSlotApp: UpdateSlot = container.get<UpdateSlot>(types.UpdateSlot);

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => updateSlotApp.handler(event, context);
