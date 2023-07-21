import { SjpDiscoveryClient } from '../sjp/SjpDiscoveryClient';
import { MunchkinClient } from './MunchkinClient';
import { EjpConnection } from '../ejp/connection';
import SjpManager from '../sjp/SjpManager';
import { EventEmitter } from '../ejp/emitter';
import { DateTime } from 'luxon';

export interface MunchkinDiscoveryItem {
	lastSeen: DateTime;
	client: MunchkinClient;
}

export interface MunchkinDiscoveryClientEventMap {
	connect: (connection: MunchkinClient) => void;
	timeout: (connection: MunchkinClient) => void;
	close: () => void;
}

export class MunchkinDiscoveryClient extends EventEmitter<MunchkinDiscoveryClientEventMap> {
	public static async start(address: string, port: number): Promise<MunchkinDiscoveryClient> {
		const discoveryClient = await SjpManager.createDiscoveryClient({address, port});
		return new MunchkinDiscoveryClient(discoveryClient);
	}

	private _discoveryClient: SjpDiscoveryClient;
	private _connections: Record<string, MunchkinDiscoveryItem> = {};
	private _intervals: ReturnType<typeof setInterval>[] = [];

	public constructor(discoveryClient: SjpDiscoveryClient) {
		super();
		this._discoveryClient = discoveryClient;
		this._setup();
	}

	public get connections(): MunchkinClient[] {
		return Object.values(this._connections)
			.map(conn => conn.client);
	}

	public close() {
		this._intervals.forEach(interval => clearInterval(interval));
		this._discoveryClient.close();
		this.emit('close');
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
					console.log('[DISCOVERY CLIENT] Found', socket);
					const connection = new EjpConnection(socket);
					const client = new MunchkinClient(connection);
					super.emit('connect', client);
					this._connections[key] = {
						client,
						lastSeen: DateTime.now(),
					};
				});
			} else {
				this._connections[key].lastSeen = DateTime.now();
			}
		});

		this._intervals.push(setInterval(() => {
			Object.entries(this._connections).forEach(([key, item]) => {
				console.log('[DISCOVERY CLIENT] Test connection', key, item.client.connection.socket, item.lastSeen, item.lastSeen.diffNow().milliseconds);
				if (item.lastSeen.diffNow().milliseconds < -10000) {
					item.client.close();
					delete this._connections[key];
					this.emit('timeout', item.client);
				}
			});
		}, 5000));
	}
}
