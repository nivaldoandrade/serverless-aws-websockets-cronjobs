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

const messageBodyVariants = cva('max-w-9/12 p-4 rounded-2xl mt-1 border whitespace-pre-wrap', {
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
	data: {
		username: string;
		message: string;
		formattedTime: string;
	}

}

export function Message({ type, data }: IMessageParams) {

	return (
		<div className={messageWrapperVariants({ type })}>
			<div className={messageHeaderVariants({ type })}>
				<span className="text-sm text-muted-foreground">
					{data.username}
				</span>
				<span className="text-xs text-muted-foreground/70">
					{data.formattedTime}
				</span>
			</div>
			<div className={messageBodyVariants({ type })}>
				{data.message}
			</div>
		</div>
	);
}
