import { SjpServerSocket } from '../sjp/SjpServerSocket';
import { MunchkinDevice, MunchkinPlayer, MunchkinPlayerData, WelcomeEvent } from './MunchkinModels';
import { EjpConnection } from '../ejp/connection';
import SjpManager from '../sjp/SjpManager';
import { SjpDiscoveryServer } from '../sjp/SjpDiscoveryServer';
import { MunchkinConnection, MunchkinConnectionEventMap } from './MunchkinConnection';

export interface MunchkinServerEventMap extends MunchkinConnectionEventMap {
}

export class MunchkinServer extends MunchkinConnection<MunchkinServerEventMap> {
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

	private constructor(discoveryServer: SjpDiscoveryServer, serverSocket: SjpServerSocket, device: MunchkinDevice) {
		super();
		this._discoveryServer = discoveryServer;
		this._serverSocket = serverSocket;
		this._device = device;
		this._setup();
	}

	public async create(player: MunchkinPlayerData): Promise<MunchkinPlayer[]> {
		console.log('[SERVER] Create player', player);
		await super.create(player);
		await this.emitSynchronize();
		return this.players;
	}

	public async update(player: MunchkinPlayer): Promise<MunchkinPlayer[]> {
		console.log('[SERVER] Update player', player);
		await super.update(player);
		await this.emitSynchronize();
		return this.players;
	}

	public async delete(playerId: number): Promise<MunchkinPlayer[]> {
		console.log('[SERVER] Delete player', playerId);
		await super.delete(playerId);
		await this.emitSynchronize();
		return this.players;
	}

	private async emitCreatePlayer(player: MunchkinPlayer): Promise<void> {
		console.log('[SERVER] Emit create players');
		await Promise.all(
			this._connections.map(conn => conn.emit('create', player))
		);
	}

	private async emitUpdatePlayer(player: MunchkinPlayer): Promise<void> {
		console.log('[SERVER] Emit update players');
		await Promise.all(
			this._connections.map(conn => conn.emit('update', player))
		);
	}

	private async emitDeletePlayer(playerId: number): Promise<void> {
		console.log('[SERVER] Emit create players');
		await Promise.all(
			this._connections.map(conn => conn.emit('delete', playerId))
		);
	}

	private async emitSynchronize(): Promise<void> {
		console.log('[SERVER] Emit synchronize');
		await Promise.all(
			this._connections.map(conn => conn.emit('synchronize', this.players))
		);
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
				console.log('[SERVER] Join event', event);
				connection.response(id, {result: true});
			});

			connection.events.on('synchronize', async () => {
				console.log('[SERVER] Synchronize request');
				await connection.emit('synchronize', this.players);
			});

			connection.events.on('create', async (player: MunchkinPlayerData) => {
				console.log('[SERVER] Received create event');
				await this.create(player);
				super.emit('update', this.players);
				await this.emitSynchronize();
			});

			connection.events.on('update', async (player: MunchkinPlayer) => {
				console.log('[SERVER] Received update event');
				await this.update(player);
				super.emit('update', this.players);
				await this.emitSynchronize();
			});

			connection.events.on('delete', async (playerId: number) => {
				console.log('[SERVER] Received update event');
				await this.delete(playerId);
				super.emit('update', this.players);
				await this.emitSynchronize();
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
