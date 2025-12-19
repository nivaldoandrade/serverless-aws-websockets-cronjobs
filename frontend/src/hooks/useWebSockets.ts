import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type WebSocketEvent = { type: 'connected', connectionId: string }
	| {
		type: 'message';
		messageId: string;
		message: string;
		connectionId: string;
		requestTimeEpoch: number;
	}

interface IUseWebSockets {
	onMessage: (data: WebSocketEvent) => void
}

export type StatusWebSocket = 'connecting' | 'open' | 'closed';

export function useWebSockets({ onMessage }: IUseWebSockets) {
	const [status, setStatus] = useState<StatusWebSocket>('connecting');
	const webSocket = useRef<WebSocket>(null);
	const memorizedOnMessage = useRef(onMessage);

	useLayoutEffect(() => {
		memorizedOnMessage.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		const ws = new WebSocket(import.meta.env.VITE_URL_SOCKET);
		webSocket.current = ws;

		function handleOpen() {
			ws.send(JSON.stringify({ action: 'connected' }));
			setStatus('open');
		}

		function handleError(event: Event) {
			console.log('WebSocket error', event);
		}

		function handleMessage(event: MessageEvent<string>) {
			const data = JSON.parse(event.data);

			memorizedOnMessage.current(data);
		}

		function handleClose(event: CloseEvent) {
			console.log('WebSocket Closed: ', event);
			setStatus('closed');
		}

		ws.addEventListener('open', handleOpen);
		ws.addEventListener('error', handleError);
		ws.addEventListener('message', handleMessage);
		ws.addEventListener('close', handleClose);

		return () => {
			ws.removeEventListener('open', handleOpen);
			ws.removeEventListener('error', handleError);
			ws.removeEventListener('message', handleMessage);
			ws.removeEventListener('close', handleClose);
			webSocket.current = null;
			ws.close();
		};
	}, []);

	const sendAction = useCallback((
		data: { action: string;[k: string]: unknown },
	) => {
		webSocket.current?.send(JSON.stringify(data));
	}, []);

	return { sendAction, status };
}
