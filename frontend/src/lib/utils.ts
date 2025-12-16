import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatToHHMM(epoch: number) {

	return new Intl.DateTimeFormat('pt-BR', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(epoch);

}
