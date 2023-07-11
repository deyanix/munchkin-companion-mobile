import { EmitterSubscription } from 'react-native';
import { EventCallback, SjpBaseSocket } from './SjpBaseSocket';

export interface SjpDiscoverEvent {
	socketId: number;
	address: string;
	port: number;
}

export class SjpDiscoveryClient extends SjpBaseSocket {
	public constructor(socketId: number) {
		super(socketId);
	}

	public onDiscover(callback: EventCallback<SjpDiscoverEvent>): EmitterSubscription {
		return this.listen('discover', callback);
	}
}
