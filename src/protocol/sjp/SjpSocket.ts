import { EventCallback, SjpBaseEvent, SjpBaseSocket } from './SjpBaseSocket';
import { EmitterSubscription } from 'react-native';
import SjpModule from './SjpModule';
import { Base64 } from 'js-base64';

export interface SjpMessageInternalEvent extends SjpBaseEvent {
	data: string;
}

export interface SjpMessageEvent<T = unknown> {
	data: T;
}

export class SjpSocket extends SjpBaseSocket {
	public constructor(socketId: number) {
		super(socketId);
	}

	public onMessage<T>(callback: EventCallback<SjpMessageEvent<T>>): EmitterSubscription {
		return this.listen<SjpMessageInternalEvent>('message', (evt) =>
			callback(JSON.parse(Base64.decode(evt.data)))
		);
	}

	public onError(callback: EventCallback): EmitterSubscription {
		return this.listen('error', callback);
	}

	public onClose(callback: EventCallback): EmitterSubscription {
		return this.listen('close', callback);
	}

	public send(message: unknown): void {
		const data = Base64.encode(JSON.stringify(message));
		SjpModule.write(this.socketId, data);
	}
}
