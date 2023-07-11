import { EjpConnection } from '../ejp/connection';
import { MunchkinDevice, WelcomeEvent } from './message';
import { EventEmitter } from '../ejp/emitter';

export interface MunchkinClientEventMap {
	welcome: () => void;
}

export class MunchkinClient extends EventEmitter<MunchkinClientEventMap> {
	private readonly _connection: EjpConnection;
	private _device: MunchkinDevice | undefined;

	public constructor(connection: EjpConnection) {
		super();
		this._connection = connection;
		this._setup();
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
