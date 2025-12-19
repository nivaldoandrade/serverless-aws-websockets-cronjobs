import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { paginateScan } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { apigwmClient } from '../clients/apigwmClient';
import { dynamoClient } from '../clients/dynamoClient';
import { bodyParser } from '../utils/bodyParser';

type SendMessageWSRouteKey = 'sendMessage' | 'connected';

export async function handler(
  event: APIGatewayProxyWebsocketEventV2,
) {
  const { connectionId, messageId, requestTimeEpoch } = event.requestContext;
  const routeKey = event.requestContext.routeKey as SendMessageWSRouteKey;

  if (routeKey === 'connected') {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        type: routeKey,
        connectionId,
      }),
    });

    await apigwmClient.send(command);
  }

  if (routeKey === 'sendMessage') {
    const body = bodyParser(event.body);

    const paginate = paginateScan(
      { client: dynamoClient },
      { TableName: process.env.TABLE_NAME },
    );

    for await (const { Items: items = [] } of paginate) {
      await Promise.allSettled(items.map(item => {
        const command = new PostToConnectionCommand({
          ConnectionId: item.connectionId,
          Data: JSON.stringify({
            connectionId,
            message: body.message,
            messageId,
            requestTimeEpoch,
          }),
        });

        return apigwmClient.send(command);
      }));
    }
  }

  return { statusCode: 200 };
}
