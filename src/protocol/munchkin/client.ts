import { EjpConnection } from '../ejp/connection';
import { MunchkinDevice, WelcomeEvent } from './message';
import { EventEmitter } from '../ejp/emitter';
import { MunchkinGame } from './game';

export interface MunchkinClientEventMap {
	welcome: () => void;
}

export class MunchkinClient extends EventEmitter<MunchkinClientEventMap> {
	private readonly _connection: EjpConnection;
	private _device: MunchkinDevice | undefined;
	private _game: MunchkinGame;

	public constructor(connection: EjpConnection) {
		super();
		this._connection = connection;
		this._game = new MunchkinGame();
		this._setup();
	}

	public get game(): MunchkinGame {
		return this._game;
	}

	public get device() {
		return this._device;
	}

	public get connection() {
		return this._connection;
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
	}
}
