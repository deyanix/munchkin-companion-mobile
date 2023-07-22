import { EventCallback, SjpBaseEvent, SjpBaseSocket } from './SjpBaseSocket';
import { EmitterSubscription } from 'react-native';
import { SjpSocket } from './SjpSocket';

export interface SjpConnectInternalEvent extends SjpBaseEvent {
	acceptedSocketId: number;
}

export interface SjpErrorInternalError extends SjpBaseEvent {
	message: string;
}

export class SjpServerSocket extends SjpBaseSocket {
	public constructor(socketId: number) {
		super(socketId);
	}

	public onConnect(callback: EventCallback<SjpSocket>): EmitterSubscription {
		return this.listen<SjpConnectInternalEvent>(
			'connect',
			(evt) => callback(new SjpSocket(evt.acceptedSocketId))
		);
	}

	public onClose(callback: EventCallback<void>): EmitterSubscription {
		return this.listen<SjpBaseEvent>('close', () => callback());
	}

	public onError(callback: EventCallback<string>): EmitterSubscription {
		return this.listen<SjpErrorInternalError>(
			'error',
			(evt) => callback(evt.message)
		);
	}
}
