
import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { connect } from '../services/connect';
import { disconnect } from '../services/disconnect';

type RouteKey = '$connect' | '$disconnect';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const { connectionId, connectedAt } = event.requestContext;
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    await connect({ connectionId, connectedAt });
  }

  if (routeKey === '$disconnect') {
    await disconnect(connectionId);
  }

  return { statusCode: 200 };
}
