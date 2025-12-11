import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

export const apigwmClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.URL_CONNECTIONS_WEBSOCKET_API,
});
