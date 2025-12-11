import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { apigwmClient } from '../clients/apigwmClient';
import { bodyParser } from '../utils/bodyParser';
import { removeItem } from '../utils/removeItem';

type RouteKey = '$connect' | '$disconnect' | 'sendMessage';

const connectionIds: Array<string> = [];

async function sendMessageToClient(message: string) {

  try {
    await Promise.allSettled(
      connectionIds.map(connId => {
        const command = new PostToConnectionCommand({
          ConnectionId: connId,
          Data: JSON.stringify(message),
        });

        return apigwmClient.send(command);
      }),
    );
  } catch (error) {
    console.log(error);
  }
}

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const body = bodyParser(event.body);
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    /*
     NA ROTA DE $CONNECT NÃO PODEMOS ENVIAR UMA MENSAGEM PARA QUEM ACABOU
     DE SE CONECTAR, SENÃO SERÁ LANÇADO A EXCEPTION GoneException.
     ENTAO PRIMEIRO ENVIAMOS A MENSAGEM PARA TODOS OS CONNECTIONSID E DEPOIS
     ADICIONAMOS QUEM ACABOU DE SE CONECTAR.
    */
    await sendMessageToClient(`O ${connectionId} conectou!`);
    connectionIds.push(connectionId);
  }

  if (routeKey === '$disconnect') {
    removeItem(connectionIds, connectionId);
  }

  if (routeKey === 'sendMessage') {
    //TODO: IMPLEMENT LOGIC WHEN BODY.MESSAGE NO EXISTS
    await sendMessageToClient(`${connectionId}: ${body.message}`);
  }

  console.log('connnectionIds: ', connectionIds);

  return { statusCode: 200 };
}
