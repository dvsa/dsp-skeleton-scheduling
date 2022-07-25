import 'dotenv/config';
import 'reflect-metadata';
import { ScheduledEvent } from 'aws-lambda';
import { container } from '../ioc/container';
import { types } from '../ioc/types';
import { ReleaseSlotsJob } from '../apps/jobs/releaseSlotsJob';

/**
 * Lambda Handler
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<APIGatewayProxyResult>}
*/
const releaseSlotsJob: ReleaseSlotsJob = container.get<ReleaseSlotsJob>(types.ReleaseSlotsJob);

export const handler = (event: ScheduledEvent): Promise<void> => releaseSlotsJob.handler(event);
