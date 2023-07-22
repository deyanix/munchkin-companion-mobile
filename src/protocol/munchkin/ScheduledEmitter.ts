import { MunchkinPlayer } from './MunchkinModels';

export type ScheduledEmitterCallback = (player: MunchkinPlayer) => void;

export class ScheduledEmitter {
	private static readonly DEBOUNCE = 2000;
	private readonly _callback: ScheduledEmitterCallback;
	private _timer: ReturnType<typeof setTimeout> | undefined;
	private _previousPlayer: MunchkinPlayer | undefined;

	public constructor(callback: ScheduledEmitterCallback) {
		this._callback = callback;
	}

	public schedule(player: MunchkinPlayer): void {
		if (this._previousPlayer?.id !== player.id) {
			this.emit();
		}
		this._previousPlayer = player;
		this._timer = setTimeout(
			() => this.emit(),
			ScheduledEmitter.DEBOUNCE
		);
	}

	protected emit(): void {
		if (this._previousPlayer) {
			this._callback(this._previousPlayer);
		}
		this.clear();
	}

	protected clear(): void {
		clearTimeout(this._timer);
		this._timer = undefined;
		this._previousPlayer = undefined;
	}
}
