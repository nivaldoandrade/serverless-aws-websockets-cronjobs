import { SendHorizonalIcon } from 'lucide-react';
import { Header } from './components/Header';
import { Message } from './components/Message';
import { Button } from './components/ui/button';

function App() {

	return (
		<div className="min-h-svh flex flex-col bg-background h-svh overflow-hidden">
			<Header />
			<main className="flex-1 flex flex-col mx-auto w-full max-w-4xl overflow-hidden">
				<div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<Message type='outgoing' />
					<Message type='incoming' />
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
