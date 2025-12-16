import { MessagesSquare } from 'lucide-react';

export function Header() {

	return (
		<header className="w-full border-b z-10 bg-card">
			<div className="flex items-center justify-between w-full max-w-4xl max mx-auto p-4">
				<div>
					<div className="flex gap-2" >
						<MessagesSquare className="size-7 text-primary" />
						<h1 className='text-xl font-bold tracking-tight text-foreground'>
							Chat Demo
						</h1>
					</div>
					<h3 className='text-sm text-muted-foreground'>
						AWS Websocket Demo
					</h3>
				</div>

				<div className='flex items-center gap-2'>
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
					<span className='text-xs font-medium text-emerald-500' >
						Online
					</span>
				</div>

			</div>
		</header>
	);
}
