import { EventCallback, SjpBaseEvent, SjpBaseSocket } from './SjpBaseSocket';
import { EmitterSubscription } from 'react-native';
import { SjpSocket } from './SjpSocket';

export interface SjpConnectInternalEvent extends SjpBaseEvent {
	acceptedSocketId: number;
}

export class SjpServerSocket extends SjpBaseSocket {
	public constructor(socketId: number) {
		super(socketId);
	}

	public onConnect(callback: EventCallback<SjpSocket>): EmitterSubscription {
		return this.listen<SjpConnectInternalEvent>('connect',
			(evt) => callback(new SjpSocket(evt.acceptedSocketId)));
	}
}
