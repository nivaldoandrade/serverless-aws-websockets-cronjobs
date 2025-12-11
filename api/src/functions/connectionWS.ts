import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

type RouteKey = '$connect' | '$disconnect';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    console.log('O usuário conectou!');
  }

  if (routeKey === '$disconnect') {
    console.log('O usuário desconectou!');
  }

  // EM FUNÇÃO DO TIPO WEBSOCKET SEMPRE TEMOS QUE RETORNAR UM STATUSCODE SUCESSO SENÃO O TUNEL NÃO É CRIADO
  return { statusCode: 200 };
}
