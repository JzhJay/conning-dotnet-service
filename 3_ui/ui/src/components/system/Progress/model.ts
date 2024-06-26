export interface ProgressMessage {
	type: string;
	label: string;
	currentMessage: string;
	progress: {numerator: number, denominator: number};
	extendData?: object;
	additionalData?: string;
}