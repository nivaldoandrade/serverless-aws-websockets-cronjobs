import type { StatusWebSocket } from '@/hooks/useWebSockets';
import { cn } from '@/lib/utils';
import { MessagesSquare } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

const statusVariants = {
	connecting: {
		label: 'Conectando...',
		dot: 'bg-orange-500',
		ping: 'bg-orange-400',
		text: 'text-orange-500',
	},
	open: {
		label: 'Online',
		dot: 'bg-emerald-500',
		ping: 'bg-emerald-400',
		text: 'text-emerald-500',
	},
	closed: {
		label: 'Offline',
		dot: 'bg-red-500',
		ping: 'bg-red-400',
		text: 'text-red-500',
	},
} as const;

interface IHeaderParams {
	status: StatusWebSocket
}

export function Header({ status }: IHeaderParams) {
	const statusVariant = statusVariants[status];

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

				<div className='flex items-center gap-3'>
					<div className='flex items-center gap-2'>
						<span className="relative flex h-3 w-3">
							<span className={cn(
								'animate-ping absolute h-full w-full rounded-full  opacity-75', statusVariant.ping,
							)}></span>
							<span className={cn(
								'relative rounded-full h-3 w-3', statusVariant.dot,
							)}></span>
						</span>
						<span className={cn(
							'text-xs font-medium', statusVariant.text,
						)} >
							{statusVariant.label}
						</span>
					</div>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
