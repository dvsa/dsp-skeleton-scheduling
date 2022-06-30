import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export interface LambdaHandler {
  handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>
}
