import { MunchkinPlayer, MunchkinPlayerData } from './MunchkinModels';
import { EventEmitter } from '../ejp/emitter';


export interface MunchkinConnectionEventMap {
	update: (players: MunchkinPlayer[]) => void;
}

export abstract class MunchkinConnection<E extends MunchkinConnectionEventMap = MunchkinConnectionEventMap> extends EventEmitter<E>  {
	private _players: MunchkinPlayer[] = [];

	get players(): MunchkinPlayer[] {
		return this._players;
	}

	set players(value: MunchkinPlayer[]) {
		this._players = value;
	}

	public abstract create(player: MunchkinPlayerData): Promise<MunchkinPlayer[]>;
	public abstract update(player: MunchkinPlayer): Promise<MunchkinPlayer[]>;
	public abstract delete(playerId: number): Promise<MunchkinPlayer[]>;
	public abstract close(): void;

	protected locallyCreate(player: MunchkinPlayer): void {
		this.players = [
			...this.players,
			player,
		];
	}

	protected locallyUpdate(player: MunchkinPlayer): void {
		const index = this._players.findIndex(p => p.id === player.id);
		if (index < 0) {
			this.locallyCreate(player);
			return;
		}
		this._players = [...this._players];
		this._players[index] = player;
	}

	protected locallyDelete(playerId: number):void {
		this._players = this._players.filter(p => p.id !== playerId);
	}
}
