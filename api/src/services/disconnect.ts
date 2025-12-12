import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamoClient';

export async function disconnect(connectionId: string) {

  const command = new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      connectionId,
    },
  });

  await dynamoClient.send(command);
}
