import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { removeItem } from '../utils/removeItem';

type RouteKey = '$connect' | '$disconnect';

const connectionIds: Array<string> = [];

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    console.log(`O ${connectionId} conectou`);
    connectionIds.push(connectionId);
  }

  if (routeKey === '$disconnect') {
    removeItem(connectionIds, connectionId);
    console.log(`O ${connectionId} desconectou`);
  }

  console.log('connnectionIds: ', connectionIds);

  return { statusCode: 200 };
}
