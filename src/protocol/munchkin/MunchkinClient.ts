import { EjpConnection } from '../ejp/connection';
import {
	MunchkinDevice,
	MunchkinPlayer, MunchkinPlayerData, WelcomeEvent,
} from './MunchkinModels';
import { MunchkinConnection, MunchkinConnectionEventMap } from './MunchkinConnection';
import { ScheduledEmitter } from './ScheduledEmitter';

export interface MunchkinClientEventMap extends MunchkinConnectionEventMap {
	welcome: () => void;
}

export class MunchkinClient extends MunchkinConnection<MunchkinClientEventMap> {
	private readonly _connection: EjpConnection;
	private readonly _scheduledEmitter: ScheduledEmitter;
	private _device: MunchkinDevice | undefined;

	public constructor(connection: EjpConnection) {
		super();
		this._connection = connection;
		this._scheduledEmitter = new ScheduledEmitter(
			(player) => connection.emit('update', player)
		);
		this._setup();
	}

	public get device() {
		return this._device;
	}

	public get connection() {
		return this._connection;
	}

	public async create(player: MunchkinPlayerData): Promise<MunchkinPlayer[]> {
		console.log('[CLIENT] Create player', player);
		await this._connection.emit('create', player);
		return this.players;
	}

	public async update(player: MunchkinPlayer): Promise<MunchkinPlayer[]> {
		console.log('[CLIENT1] Update player', player);
		super.locallyUpdate(player);
		this._scheduledEmitter.schedule(player);
		return this.players;
	}

	public async delete(playerId: number): Promise<MunchkinPlayer[]> {
		console.log('[CLIENT] Delete player', playerId);
		super.locallyDelete(playerId);
		await this._connection.emit('delete', playerId);
		return this.players;
	}

	public async synchronize(): Promise<void> {
		await this._connection.emit('synchronize');
	}

	public close(): void {
		this._connection.socket.close();
	}

	private async _setup(): Promise<void> {
		this._connection.events.on('welcome', (event: WelcomeEvent) => {
			if (this._device) {
				throw new Error('Server initialized connection again');
			}
			this._device = event.device;
			super.emit('welcome');
		});

		this._connection.events.on('create', (player: MunchkinPlayer) => {
			console.log('[CLIENT] Create event', player);
			super.locallyCreate(player);
			super.emit('update', this.players);
		});

		this._connection.events.on('update', (player: MunchkinPlayer) => {
			console.log('[CLIENT] Update event', player);
			super.locallyUpdate(player);
			super.emit('update', this.players);
		});

		this._connection.events.on('delete', (playerId: number) => {
			console.log('[CLIENT] Delete event', playerId);
			super.locallyDelete(playerId);
			super.emit('update', this.players);
		});

		this._connection.events.on('synchronize', (players: MunchkinPlayer[]) => {
			console.log('[CLIENT] Synchronize', players);
			this.players = players;
			super.emit('update', players);
		});
	}
}
