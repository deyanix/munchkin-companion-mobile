import { EjpConnection } from '../ejp/connection';
import {
	MunchkinDevice,
	MunchkinPlayer, MunchkinPlayerData, WelcomeEvent,
} from './MunchkinModels';
import { MunchkinConnection, MunchkinConnectionEventMap } from './MunchkinConnection';

export interface MunchkinClientEventMap extends MunchkinConnectionEventMap {
	welcome: () => void;
}

export class MunchkinClient extends MunchkinConnection<MunchkinClientEventMap> {
	private readonly _connection: EjpConnection;
	private _device: MunchkinDevice | undefined;

	public constructor(connection: EjpConnection) {
		super();
		this._connection = connection;
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
		return super.create(player);
	}

	public async update(player: MunchkinPlayer): Promise<MunchkinPlayer[]> {
		console.log('[CLIENT] Update player', player);
		await super.update(player);
		await this._connection.emit('update', player);
		return ;
	}

	public async delete(playerId: number): Promise<MunchkinPlayer[]> {
		console.log('[CLIENT] Delete player', playerId);
		await this._connection.emit('delete', playerId);
		return super.delete(playerId);
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

		this._connection.events.on('synchronize', (players: MunchkinPlayer[]) => {
			console.log('[CLIENT] Synchronize', players);
			super.emit('update', players);
		});
	}
}
