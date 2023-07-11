import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import SjpModule from './SjpModule';

export type EventCallback<T = SjpBaseEvent> = (data: T) => void;

export interface SjpBaseEvent {
	socketId: number;
}

export abstract class SjpBaseSocket {
	private readonly _socketId: number;

	public constructor(socketId: number) {
		this._socketId = socketId;
	}

	public get socketId() {
		return this._socketId;
	}

	public close() {
		console.log('Start closing', this.socketId);
		SjpModule.close(this.socketId);
		console.log('End close');
	}

	protected listen<T extends SjpBaseEvent>(name: string, callback: EventCallback<T>): EmitterSubscription {
		const eventEmitter = new NativeEventEmitter(NativeModules.SjpModule);
		return eventEmitter.addListener(name, (event: T) => {
			if (event.socketId === this._socketId) {
				callback(event);
			}
		});
	}
}
