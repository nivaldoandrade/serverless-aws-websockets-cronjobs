
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { apigwmClient } from '../clients/apigwmClient';
import { connect } from '../services/connect';
import { disconnect } from '../services/disconnect';

type RouteKey = '$connect' | '$disconnect' | 'connected';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const { connectionId, connectedAt } = event.requestContext;
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    await connect({ connectionId, connectedAt });
  }

  if (routeKey === '$disconnect') {
    await disconnect(connectionId);
  }

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

  return { statusCode: 200 };
}
