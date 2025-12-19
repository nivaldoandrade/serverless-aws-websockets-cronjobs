import { Loader2Icon, SendHorizonalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Message } from './components/Message';
import { Button } from './components/ui/button';
import { useWebSockets, type WebSocketEvent } from './hooks/useWebSockets';
import { formatToHHMM } from './lib/utils';

interface IMessage {
	messageId: string
	username: string;
	message: string;
	formattedTime: string;
}

function App() {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Array<IMessage>>([]);
	const [user, setUser] = useState('');

	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const { sendAction, status } = useWebSockets({
		onMessage: handleSocketMessage,
	});

	function handleSocketMessage(data: WebSocketEvent) {
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

	function sendMessage() {
		if (message.trim() !== '') {
			const data = {
				action: 'sendMessage',
				message,
			};

			sendAction(data);
			setMessage('');
		}
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		sendMessage();
	}

	function handleKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	) {

		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();

			sendMessage();
		}
	}

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
			<Header status={status} />
			<main className="flex-1 flex flex-col mx-auto w-full max-w-4xl overflow-hidden">
				{status === 'connecting' && (
					<div className='grid place-items-center h-screen'>
						<Loader2Icon className="animate-spin size-24 text-muted-foreground" />
					</div>
				)}

				{status === 'open' && (
					<>
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

						<form
							className="w-full bg-transparent p-4"
							onSubmit={handleSubmit}
						>
							<div className="relative flex items-center gap-2 py-2 px-4 rounded-xl bg-card border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200">
								<textarea
									name="message"
									value={message}
									placeholder='Digite sua mensagem...'
									rows={1}
									style={{ scrollbarWidth: 'none' }}
									onKeyDown={handleKeyDown}
									onChange={(e) => setMessage(e.target.value)}
									className="w-full resize-none max-h-24 min-h-11 py-2.5 focus:outline-0 field-sizing-content"
								/>
								<Button
									type='submit'
									className="h-10"
									disabled={status !== 'open' || !message.trim()}
								>
									<SendHorizonalIcon size={16} />
								</Button>
							</div>
							<span className="block text-center text-xs text-muted-foreground mt-2">
								Pressione "Enter" para enviar e "Shift + Enter" para uma nova linha
							</span>
						</form>
					</>
				)}
			</main>
		</div>
	);
}

export default App;
