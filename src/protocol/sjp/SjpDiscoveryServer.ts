import { SjpBaseSocket } from './SjpBaseSocket';

export class SjpDiscoveryServer extends SjpBaseSocket {
	public constructor(socketId: number) {
		super(socketId);
	}
}
