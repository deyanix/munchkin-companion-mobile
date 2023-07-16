import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import SjpModule from './SjpModule';

export type EventCallback<T = SjpBaseEvent> = (data: T) => void;

export interface SjpBaseEvent {
	socketId: number;
}

export abstract class SjpBaseSocket {
	private readonly _socketId: number;
	private _closed: boolean = false;

	protected constructor(socketId: number) {
		this._socketId = socketId;
		this.listen('close', () => {
			this._closed = true;
		});
	}

	public get socketId() {
		return this._socketId;
	}

	public get closed(): boolean {
		return this._closed;
	}

	public close() {
		console.log('[SOCKET BASE] Try close socket id =', this.socketId, 'close =', this.closed);
		if (!this._closed) {
			this._closed = true;
			SjpModule.close(this.socketId);
		}
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
