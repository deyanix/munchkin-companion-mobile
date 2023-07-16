import { EjpConnection } from '../ejp/connection';
import { MunchkinDevice, WelcomeEvent } from './message';
import { EventEmitter } from '../ejp/emitter';
import { MunchkinPlayer } from './game';

export interface MunchkinClientEventMap {
	welcome: () => void;
	update: (players: MunchkinPlayer[]) => void;
}

export class MunchkinClient extends EventEmitter<MunchkinClientEventMap> {
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

	public update(players: MunchkinPlayer[]): void {
		this._connection.emit('update', players);
	}

	public async synchronize(): Promise<MunchkinPlayer[]> {
		return this._connection.request('synchronize');
	}

	public close() {
		this._connection.socket.close();
	}

	private _setup() {
		this._connection.events.on('welcome', (event: WelcomeEvent) => {
			if (this._device) {
				throw new Error('Server initialized connection again');
			}
			this._device = event.device;
			super.emit('welcome');
		});

		this._connection.events.on('update', (players: MunchkinPlayer[]) => {
			super.emit('update', players);
		});
	}
}
