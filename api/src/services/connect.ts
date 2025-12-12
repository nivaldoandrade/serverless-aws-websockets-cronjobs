import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamoClient';

interface IConnectParams {
  connectionId: string;
  connectedAt: number;
}

export async function connect({ connectionId, connectedAt }: IConnectParams) {

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId,
      connectedAt,
    },
  });

  await dynamoClient.send(command);

}
