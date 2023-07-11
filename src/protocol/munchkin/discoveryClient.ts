import { SjpDiscoveryClient } from '../sjp/SjpDiscoveryClient';
import { MunchkinClient } from './client';
import { EjpConnection } from '../ejp/connection';
import SjpManager from '../sjp/SjpManager';
import { EventEmitter } from '../ejp/emitter';

export interface MunchkinDiscoveryClientEventMap {
	connect: (connection: MunchkinClient) => void;
}

export class MunchkinDiscoveryClient extends EventEmitter<MunchkinDiscoveryClientEventMap> {
	public static async start(address: string, port: number): Promise<MunchkinDiscoveryClient> {
		const discoveryClient = await SjpManager.createDiscoveryClient({address, port});
		return new MunchkinDiscoveryClient(discoveryClient);
	}

	private _discoveryClient: SjpDiscoveryClient;
	private _connections: Record<string, MunchkinClient> = {};

	public constructor(discoveryClient: SjpDiscoveryClient) {
		super();
		this._discoveryClient = discoveryClient;
		this._setup();
	}

	public close() {
		return this._discoveryClient.close();
	}

	private _setup() {
		this._discoveryClient.onDiscover((event) => {
			const key = [event.address, event.port].join(':');
			if (!this._connections[key]) {
				setImmediate(async () => {
					const socket = await SjpManager.createSocket({
						address: event.address,
						port: event.port,
					});
					const connection = new EjpConnection(socket);
					const client = new MunchkinClient(connection);
					super.emit('connect', client);
					this._connections[key] = client;
				});
			}
		});
	}
}
