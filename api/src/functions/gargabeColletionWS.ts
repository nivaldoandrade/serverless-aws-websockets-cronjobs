import { GetConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DeleteCommand, paginateScan } from '@aws-sdk/lib-dynamodb';
import { apigwmClient } from '../clients/apigwmClient';
import { dynamoClient } from '../clients/dynamoClient';

export async function handler() {

  const paginate = paginateScan(
    { client: dynamoClient },
    { TableName: process.env.TABLE_NAME },
  );

  for await (const { Items: items = [] } of paginate) {
    await Promise.allSettled(items.map(async (item) => {
      try {
        const command = new GetConnectionCommand({
          ConnectionId: item.connectionId,
        });

        await apigwmClient.send(command);
      } catch {
        const deleteCommand = new DeleteCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            connectionId: item.connectionId,
          },
        });

        await dynamoClient.send(deleteCommand);
      }
    }));
  }
}
