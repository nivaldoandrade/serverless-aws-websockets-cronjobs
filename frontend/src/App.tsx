import { SendHorizonalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Message } from './components/Message';
import { Button } from './components/ui/button';
import { formatToHHMM } from './lib/utils';

interface IMessage {
	messageId: string
	username: string;
	message: string;
	formattedTime: string;
}

function App() {
	const [messages, setMessages] = useState<Array<IMessage>>([]);
	const [user, setUser] = useState('');

	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ws = new WebSocket(import.meta.env.VITE_URL_SOCKET);

		function handleOpen() {
			ws.send(JSON.stringify({ action: 'connected' }));
		}

		function handleMessage(event: MessageEvent<string>) {
			const data = JSON.parse(event.data);

			if (data.type === 'connected') {
				setUser(data.connectionId);
				return;
			}

			setMessages(prevState => prevState.concat({
				messageId: data.messageId,
				message: data.message,
				username: data.connectionId,
				formattedTime: formatToHHMM(data.requestTimeEpoch),
			}));

		}

		ws.addEventListener('open', handleOpen);
		ws.addEventListener('message', handleMessage);

		return () => {
			ws.removeEventListener('message', handleMessage);
			ws.removeEventListener('open', handleOpen);
			ws.close();
		};
	}, []);

	useEffect(() => {
		if (!messagesContainerRef.current) {
			return;
		}

		const lastMessage = messagesContainerRef.current.lastElementChild;
		lastMessage?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, [messages]);

	return (
		<div className="min-h-svh flex flex-col bg-background h-svh overflow-hidden">
			<Header />
			<main className="flex-1 flex flex-col mx-auto w-full max-w-4xl overflow-hidden">
				<div
					ref={messagesContainerRef}
					className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{messages.map((messageInfo) => (
						<Message
							key={messageInfo.messageId}
							type={messageInfo.username === user ? 'outgoing' : 'incoming'}
							data={messageInfo}
						/>
					))}
				</div>

				<div className="w-full bg-transparent p-4">
					<div className="relative flex items-center gap-2 py-2 px-4 rounded-xl bg-card border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200">
						<textarea
							name="message"
							placeholder='Digite sua mensagem...'
							rows={1}
							className="w-full resize-none max-h-96 min-h-11 py-2.5 focus:outline-0"
							style={{ scrollbarWidth: 'none' }}
						/>
						<Button className="h-10">
							<SendHorizonalIcon size={16} />
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
