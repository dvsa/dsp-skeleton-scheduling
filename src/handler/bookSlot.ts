import 'dotenv/config';
import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { container } from '../ioc/container';
import { types } from '../ioc/types';
import { BookSlot } from '../apps/bookSlot';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const bookSlotApp: BookSlot = container.get<BookSlot>(types.BookSlot);

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => bookSlotApp.handler(event, context);
