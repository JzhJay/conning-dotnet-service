import {UserId} from 'stores';

export type NotificationTarget = "system" | "simulation" | "billing";
export type SystemNotificationTrigger = "grid_on" | "grid_off" | "grid_uptime_threshold";
export type SimulationNotificationTrigger = "runtime_threshold" | "start" | "parse" | "compile" | "stored" | "failed";
export type BillingNotificationTrigger = "bill_ready" | "threshold";

export type NotificationTrigger = SystemNotificationTrigger | SimulationNotificationTrigger | BillingNotificationTrigger;

export interface NotificationTriggerParam {
	descr: string,
	type?: 'currency' | 'timespan' | 'int' | "double",
	defaultValue?: any;
	name: string;
}

export type NotificationSeverity = 'info' | 'warning' | 'error';

export interface NotificationTriggerDefinition {
	trigger: NotificationTrigger;
	descr: string;
	severity: NotificationSeverity;

	params?: Array<NotificationTriggerParam>;
}

export interface NotificationSubscription {
	_id?: string;
	owner?: UserId;
	target?: NotificationTarget;
	trigger?: NotificationTrigger;
	severity: NotificationSeverity;
	extra?: any;
	email?: boolean;
	emailSecondary?: boolean;
	mobile?: boolean;
	desktop?: boolean;
}

export interface NotificationEvent {
	userId?: string,
	title?: string,
	message?: string,
	timeout?: number
}


export interface SentNotification{
	_id?: string;
	owner: UserId;
	delivered: boolean;
	endpoint: {type:string, value:string};
	title: string;
	sentTime: string;
}

export type NotificationScope = 'user' | 'account';