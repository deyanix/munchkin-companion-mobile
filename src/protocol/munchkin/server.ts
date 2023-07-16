import { SjpServerSocket } from '../sjp/SjpServerSocket';
import { MunchkinDevice, WelcomeEvent } from './message';
import { EjpConnection } from '../ejp/connection';
import SjpManager from '../sjp/SjpManager';
import { SjpDiscoveryServer } from '../sjp/SjpDiscoveryServer';
import { MunchkinPlayer } from './game';
import { EventEmitter } from '../ejp/emitter';

export interface MunchkinServerEventMap {
	update: (players: MunchkinPlayer[]) => void;
}

export class MunchkinServer extends EventEmitter<MunchkinServerEventMap> {
	public static async start(port: number, device: MunchkinDevice): Promise<MunchkinServer> {
		const [discoveryServer, serverSocket] = await Promise.all([
			SjpManager.createDiscoveryServer(({port})),
			SjpManager.createServerSocket({port}),
		]);

		return new MunchkinServer(discoveryServer, serverSocket, device);
	}

	private static readonly VERSION = '1.0';
	private readonly _device: MunchkinDevice;
	private readonly _discoveryServer: SjpDiscoveryServer;
	private readonly _serverSocket: SjpServerSocket;
	private readonly _connections: EjpConnection[] = [];
	private _players: MunchkinPlayer[] = [];

	public constructor(discoveryServer: SjpDiscoveryServer, serverSocket: SjpServerSocket, device: MunchkinDevice) {
		super();
		this._discoveryServer = discoveryServer;
		this._serverSocket = serverSocket;
		this._device = device;
		this._setup();
	}

	get players(): MunchkinPlayer[] {
		return this._players;
	}

	set players(value: MunchkinPlayer[]) {
		this._players = value;
	}

	public update(players: MunchkinPlayer[]): void {
		this._connections.forEach(conn => conn.emit('update', players));
	}

	public close() {
		this._serverSocket.close();
		this._discoveryServer.close();
	}

	private _setup() {
		this._serverSocket.onConnect(async (socket) => {
			const connection = new EjpConnection(socket);
			this._connections.push(connection);

			connection.requests.on('join', (event, id) => {
				console.log('[SERVER] Join event ', event);
				connection.response(id, {result: true});
			});

			connection.requests.on('synchronize', (_, id) => {
				console.log('[SERVER] Synchronize request');
				connection.response(id, this._players);
			});

			connection.events.on('update', (players: MunchkinPlayer[]) => {
				console.log('[SERVER] Received update event');
				super.emit('update', players);
			});

			socket.onClose(() => {
				this._connections.splice(this._connections.indexOf(connection), 1);
			});

			await connection.emit<WelcomeEvent>('welcome', {
				device: this._device,
				version: MunchkinServer.VERSION,
			});
		});
	}
}
