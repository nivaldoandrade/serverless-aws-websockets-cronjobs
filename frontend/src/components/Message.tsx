import { cva } from 'class-variance-authority';

const messageWrapperVariants = cva('flex flex-col', {
	variants: {
		type: {
			incoming: 'items-start',
			outgoing: 'items-end',
		},
	},
	defaultVariants: {
		type: 'incoming',
	},
});

const messageHeaderVariants = cva('flex items-baseline gap-1.5', {
	variants: {
		type: {
			incoming: '',
			outgoing: 'flex-row-reverse',
		},
	},
	defaultVariants: {
		type: 'incoming',
	},
});

const messageBodyVariants = cva('max-w-9/12 p-4 rounded-2xl mt-1 border', {
	variants: {
		type: {
			incoming: 'bg-card text-card-foreground rounded-tl-none',
			outgoing: 'bg-primary text-primary-foreground rounded-tr-none',
		},
	},
	defaultVariants: {
		type: 'incoming',
	},
});

interface IMessageParams {
	type: 'incoming' | 'outgoing'
}

export function Message({ type }: IMessageParams) {

	return (
		<div className={messageWrapperVariants({ type })}>
			<div className={messageHeaderVariants({ type })}>
				<span className="text-sm text-muted-foreground">Você</span>
				<span className="text-xs text-muted-foreground/70">10:24 AM</span>
			</div>
			<div className={messageBodyVariants({ type })}>
				Olá, tudo bem?
			</div>
		</div>
	);
}
