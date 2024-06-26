import {IToaster, IToastOptions, IToastProps} from "@blueprintjs/core";

export class MockToaster implements IToaster {
	show(props: IToastProps): string {
		return undefined;
	}

	update(key: string, props: IToastProps): void {
	}

	dismiss(key: string): void {
	}

	clear(): void {
	}

	getToasts(): IToastOptions[] {
		return [];
	}

}