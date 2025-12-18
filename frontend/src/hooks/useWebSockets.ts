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

export function useWebSockets({ onMessage }: IUseWebSockets) {
	const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
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

		ws.addEventListener('open', handleOpen);
		ws.addEventListener('error', handleError);
		ws.addEventListener('message', handleMessage);

		return () => {
			ws.removeEventListener('open', handleOpen);
			ws.removeEventListener('error', handleError);
			ws.removeEventListener('message', handleMessage);
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
