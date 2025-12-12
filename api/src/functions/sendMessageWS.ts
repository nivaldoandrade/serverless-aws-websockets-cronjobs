import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { paginateScan } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { apigwmClient } from '../clients/apigwmClient';
import { dynamoClient } from '../clients/dynamoClient';
import { bodyParser } from '../utils/bodyParser';

export async function handler(
  event: APIGatewayProxyWebsocketEventV2,
) {

  const body = bodyParser(event.body);

  const paginate = paginateScan(
    { client: dynamoClient },
    { TableName: process.env.TABLE_NAME },
  );

  for await (const { Items: items = [] } of paginate) {
    await Promise.allSettled(items.map(item => {
      const command = new PostToConnectionCommand({
        ConnectionId: item.connectionId,
        Data: JSON.stringify(`${item.connectionId}: ${body.message}`),
      });

      return apigwmClient.send(command);
    }));
  }

  return { statusCode: 200 };
}
