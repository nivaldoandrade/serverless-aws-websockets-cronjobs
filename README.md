# Serverless AWS WebSockets e Cronjobs (Chat Demo)

Esta aplicação demonstra a implementação de um chat em tempo real utilizando WebSockets da AWS com API Gateway e DynamoDB. O projeto é separado por um frontend React com Vite e um backend serverless com AWS Lambda, API Gateway WebSocket e DynamoDB, fornecendo uma experiência de chat com comunicação bidirecional em tempo real e limpeza automática de conexões obsoletas.

Este repositório contém dois projetos relacionados para demonstrar um fluxo de chat em tempo real:

- `api`: API serverless (Serverless Framework + AWS) que gerencia conexões WebSocket, mensagens e limpeza automática de conexões;
- `frontend`: Aplicação React + Vite que permite aos usuários enviar e receber mensagens em tempo real.

## Funcionalidades
- **Chat em tempo real**: Comunicação bidirecional instantânea entre usuários;
- **Gereciamento de conexões**: Armazenamento automático de conexões ativas no DynamoDB;
- **Sistema de broadcast**: Mensagens enviadas para todos os usuários conectados;
- **Limpeza automática**: Cronjob que remove conexões obsoletas a cada 10 minutios;
- **Interface moderna**: UI responsiva com tema light/dark;
- **Identificação de usuários**: Cada conexão recebe um id único;
- **Timestamps**: Exibição de horário de envio para cada mensagem;
- **Status de conexão**: Indicador visual do status da conexão WebSocket.
  
## Arquitetura
![Diagrama da Arquitetura](/api/assets/diagrama-arquitetura.png)

## Fluxo de Comunicação

### Conexão
1. Cliente estabelece conexão WebSocket com API Gateway;
2. Lambda `connectionWS` é acionada no evento `$connect`;
3. `connectionId` e `connectedAt` são armazenados no DynamoDB;
4. Lambda `sendMessageWS` envia confirmação com route `connected`;
5. Cliente recebe seu `connectionId`.


### Envio de Mensagem
1. Cliente envia mensagem via WebSocket com action `sendMessage`;
2. Lambda `sendMessageWS` é acionada;
3. Lambda consulta todas as conexões ativas no DynamoDB;
4. Mensagem é enviada para todos os clientes conectados via broadcast;
5. Mensagem inclui `connectionId`, `message`, `messageId`, `requestTimeEpoch`.

### Desconexão
1. Cliente fecha a conexão WebSocket;
2. Lambda `connectionWs` é acionada no evento `$disconnect`;
3. `connectionId` é removido do DynamoDB.

### Limpeza Automática (Garbage Collection)
1. EventBridge dispara Lambda `garbageCollectionWS` a cada 10 minutos;
2. Lambda escaneia todas as conexões no DynamoDB;
3. Tenta enviar comando `GetConnection` para cada conexão;
4. Conexões inválidas são automaticamente removidas do DynamoDB;

## Pré-requisitos

- [Node.js 20 ou superior](https://nodejs.org/en/)
- Yarn ou outro package manager
- [Serverless](https://www.serverless.com)
- [Credenciais AWS configuradas](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#aws-credentials)

## Configuração do Serverless
1. Instale o Serverless via NPM:

   ```bash
   npm i serverless -g
   ```

   Para mais informações: [Installation](https://www.serverless.com/framework/docs/getting-started#installation).

2. Faça login no Serverless:

   Crie uma conta no Serverless e faça login com o comando abaixo:

   ```bash
   sls login
   ```

   Para mais informações: [Signing In](https://www.serverless.com/framework/docs/getting-started#signing-in).

#### Configuração das Credenciais AWS

Para mais informações: [AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#aws-credentials)

##### **Opção 1: AWS CLI (Recomendado)**

1. Faça o download e instalação: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions).

2. Crie um: [IAM user](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-create)

   **OBS:** No **Attach existing policies directly** e procure e adicione a política **AdministratorAccess**.

3. Configure AWS CLI:

   ```bash
   aws configure
   ```

   Preencha com:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region: `us-east-1`
   - Default output format: `json`

   Para mais informações: [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-configure.title)
****

##### **Opção 2: Variáveis de Ambiente**

1. Crie um: [IAM user](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-create)

   **OBS:** No **Attach existing policies directly** e procure e adicione a política **AdministratorAccess**.

2. Crie um arquivo `.env` na raiz do projeto `api/` e preencha com os valores de `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.
  

## Passo a passo

### Backend

1. Clone o repositório:
    ```bash
    git clone https://github.com/nivaldoandrade/serverless-aws-websockets-cronjobs

    cd serverless-aws-websockets-cronjobs/api
    ```

2. Instale as dependências:
	```bash
	# No diretório api
	yarn
	# ou
	npm install
	```

3. Realize o deploy na AWS:
	```bash
	sls deploy
   ```

	Se tudo ocorrer bem, o output esperado será:
	```plaintext
	endpoint: wss://xxxxxxxxxx.execute-api.sa-east-1.amazonaws.com/dev
	functions:
	  connectionWS: api-dev-connectionWS
	  sendMessageWS: api-dev-sendMessageWS
	  garbageCollectionWS: api-dev-garbageCollectionWS
	```

	O endpoint base da API será: `wss://xxx.execute-api.sa-east-1.amazonaws.com/dev`

### Frontend

4. Configure a variável de ambiente do frontend:
	```bash
		cd ../frontend

		#Copie o arquivo de exemplo
		cp .env.example .env

		#Edite o arquivo .env e adicionei a URL da API
		#VITE_API_URL=wss://xxx.execute-api.sa-east-1.amazonaws.com/dev
	```
5. Instale as dependências do frontend:
   ```bash
	# No diretório frontend
	yarn
	# ou
	npm install
	 ```

6. Inicie o servidor de desenvolvimento:
   ```bash
	 yarn dev
	 # ou
	 npm run dev
	 ```

	O frontend estará disponível em: http://localhost:5173

	## Endpoints

| Route Key   | Descrição                              | Exemplo de playload                        |
| ----------- | -------------------------------------- | ------------------------------------------ |
| $connect    | Estabelece conexão e salva no DynamoDB | (Automático ao conectar)                   |
| $disconnect | Remove conexão do DynamoDB             | (Automático ao desconectar)                |
| connected   | Retorna connectionId para o cliente    | [Payload](#servidor---cliente-connected)   |
| sendMessage | Envia Mesangem para todos os clientes  | [Payload](#cliente---servidor-sendmessage) |

### Formato das Mensagens

#### Servidor -> Cliente (connected)
``` JSON
{
	"type": "connected",
	"connectionId": "abc123xyz..."
}
```
#### Cliente -> Servidor (sendMessage)
``` JSON
{
	"action": "sendMessage",
	"message": "Texto da mensagem"
}
```
#### Servidor -> Cliente (broadcast)
``` JSON
{
	"connectionId": "abc123xyz...",
	"message": "Texto da mensagem",
	"messageId": "def456uvw...",
	"requestTimeEpoch": 1733702400000
}
```
### Testando com wscat

O wscat é uma ferramenta de linha de comando para testar conexões WebSocket. 
É muito útil para testar o backend sem precisar do frontend.

1. Instalação do wscat
``` bash
npm install -g wscat
```

2. Conectando ao WebSocket
```bash
# Substitua a URL pela URL do seu WebSocket endpoint
wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev
```
### Exemplos de Uso

1. Conectar e receber connectionId

	Após conectar, envie a action `connected`:
	```bash
	# Conectar
	wscat -c wss://xxxxxxxxxx.execute-api.sa-east-1.amazonaws.com/dev

	# Enviar (após conectado)
	> {"action": "connected"}

	# Resposta esperada
	< {"type":"connected","connectionId":"abc123xyz..."}
	```
2. Enviar mensagem para todos os clientes
	```bash
	# Após conectado, envie uma mensagem
	> {"action": "sendMessage", "message": "Olá do terminal!"}

	# Todos os clientes conectados receberão
	< {"connectionId":"abc123xyz...","message":"Olá do terminal!","messageId":"def456uvw...","requestTimeEpoch":1733702400000}
	```
3. Testar com mútiplas conexões
	
	Abra múltiplos terminais para simular vários usuários:

	#### Terminal 1:
	``` bash
	wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev

	> {"action": "connected"}
	< {"type":"connected","connectionId":"user1-abc123"}

	> {"action": "sendMessage", "message": "Mensagem do usuário 1"}
	```

	#### Terminal 2:
	``` bash
	wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev

	> {"action": "connected"}
	< {"type":"connected","connectionId":"user2-def456"}

	# Você verá a mensagem do usuário 1
	< {"connectionId":"user1-abc123","message":"Mensagem do usuário 1",...}

	> {"action": "sendMessage", "message": "Mensagem do usuário 2"}
	```
4. Desconectar
   ```bash
	 # Pressione Ctrl+C ou CMD+C ou digite
	 exit
	 ```

#### Dicas de uso do wscat
1. Opções úteis:
   ```bash
		# Conectar com headers customizados
		wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev -H "Authorization: Bearer token"

		# Modo debug (mostra headers)
		wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev --show-headers

		# Desconectar após N segundos
		wscat -c wss://xxx.execute-api.sa-east-1.amazonaws.com/dev -x 30
	 ```

2. **Formato JSON**: Sempre envie json válido, caso contrário você receberá erro de `Malformed body`.
   
3. **Monitorar logs**: Matenha os logs da Lambda abertos em outro terminal:
   ```bash
		sls logs -f sendMessageWS --t
	 ```
#### Troubleshooting wscat

**Erro de conexão**:
```bash
error: connect ECONNREFUSED
```
- Verifique se a url do WebSocket está correta;
- Confirme que o backend foi deployado com sucesso.
  
**Erro "Malformed body"**:
```bash
< {"message": "Internal server error"}
```
- Verifique se você está enviado json válido;
- Confirme que o formato do payload está correto.
  
**Sem resposta após enviar mensagem**:
- Verifique se há outras conexões ativas(o broadcast só funciona se houver destinatários);
- Consulte os logs da Lambda no CloudWatch para ver erros.

## Tecnologia Utilizadas
### Frontend

- React;
- Vite;
- TypeScript;
- Tailwind css;
- Shadcn.

### Backend

- Serverless Framework v4;
- AWS (Lambda, API Gateway, WebSocket, DynamoDB, EventBridge);
- TypeScript;
- Zod.

## Recursos criados AWS

- DynamoDB: `api-{stage}-ConnectionsTable`;
  - Chave primária: `connectionId`(String);
  - `connectedAt`(String).
- Lambda Functions:
  - `api-{stage}-connectionWS`: Gerencia eventos `$connect`, `$disconnect`;
  - `api-{stage}-sendMessageWS`: Gerencia eventos `sendMessage`, `connected`;
  - `api-{stage}-garbageCollectionWS`: Limpeza automática a cada 10 minutos.
- Api Gateway(WebSocket): `{stage}-api`
  - Rotas: `$connect`, `$disconnect`, `sendMessage` e `connected`;
  - URL: `wss://xxx.execute-api.sa-east-1.amazonaws.com/{stage}`.
- EventBridge Rule: Dispara a Lambda `api-{stage}-garbageCollectionWS` a cada 10 minutos;

## Comandos Úteis

### Backend

``` bash
cd api

# Deploy completo
sls deploy

# Deploy de função específica
sls deploy function -f connectionWS

# Visualizar logs
sls logs -f sendMessageWS --t

# Visualizar logs do garbage collection
sls logs -f garbageCollectionWS --tail

# Remover stack
sls remove
```
### Frontend

```bash
cd frontend

# Desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview do build
yarn preview

# Lint
yarn lint
```

## Troubleshooting

### Frontend não conecta com o WebSocket

- Verifique se a variável `VITE_API_SOCKET` está configurada corretamente no `.env`;
- Certifique-se que o backend foi deployado com sucesso;
- Confirme que a url é `wss://`, e não `https://`;
- Verifique os logs da função `connectionWS` no CloudWatch.

### Mensagens não estão sendo recebidas

- Verifique se o status da conexão está como 'Online' no header da página no frontend;
- Confirme que outras conexões estão ativas(teste em múltiplas abas);
- Verifique os logs da função `sendMessageWS` no CloudWatch;
- Confirme que o `connectionId` está sendo armazenado no DynamoDB.

### Erro ao enviar mensagem

- Verifique se a mensagem não está vazia;
- Confirme que o formato do playload está correto;
- Verifique se a conexão WebSocket está ativa;
- Consulte os logs de erro no console do navegador.

### Conexões antigas não são removidas

- Verifique se a função `garbageCollectionWS` está sendo executada(EventBridge);
- Consulte os logs do `garbageCollectionWS` no CloudWatch;
- Verifique se existe conexões obsoletas no DynamoDB.
  
### Performance lenta no chat

- Verifique sua conexão de internet;
- Confirme que não existe muitas conexões simultâneas;
- Considere aumentar a memória das Lambdas;
- Monitore os logs de throttling no CloudWatch.

### Erro de permissão no DynamoDB

- Verifique se a role da Lambda tem as permissões necessárias:
  - `dynamodb:PutItem`;
  - `dynamodb:DeleteItem`;
  - `dynamodb:Scan`.
- Confirme que a `TABLE_NAME` está correto nas variáveis de ambiente;
- Verifique os logs de erro no CloudWatch.

## Considerações de Produção

Para uso em produção:

### Segurança

- Implementar autenticação/autorização (Cognito e JWT);
- Adicionar rate limiting para prevenir spam;
- Validar e sanitizar mensagens antes de enviar;
- Implementar lista de permissões de origens;
- Criptografar dados sensíveis no DynamoDB.

### Escalabilidade

- Considerar usar DynamoDB Streams para processamento assíncrono;
- Adicionar índices secundários para queries otimizadas;
- Usar DynamoDB Auto Scaling para lidar com picos.

### Monitoramento

- Configurar CloudWatch Alarms para:
  - Erros de Lambda;
  - Throttling de DynamoDB;
  - Conexões WebSocket ativas;
  - Latência de mensagens;
- Implementar logging estruturado com níveis (INFO, WARN, ERROR).

### Confiabilidade

- Implementar DLQ para mensagens falhadas;
- Adicionar retry exponencial para operações do DynamoDB;
- Implementar circuit breaker para calls externas;
- Configurar backup automático do DynamoDB;
- Adicionar health checks nas Lambdas. 

### Perfomance

- Ajustar memória das Lambdas baseado em testes;
- Considerar usar Lambda Provisioned Concurrency;
- Implementar cache de conexões ativas quando apropriado;
- Reduzir payload das mensagens quando possível.

### UX/UI

- Adicionar indicador de "digitando...";
- Adicionar notificações para novas mensagens;
- Adicionar confirmação visual de mensagem enviada.
