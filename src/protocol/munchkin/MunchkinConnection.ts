import { MunchkinPlayer, MunchkinPlayerData } from './MunchkinModels';
import { EventEmitter } from '../ejp/emitter';


export interface MunchkinConnectionEventMap {
	update: (players: MunchkinPlayer[]) => void;
}

export abstract class MunchkinConnection<E extends MunchkinConnectionEventMap = MunchkinConnectionEventMap> extends EventEmitter<E>  {
	private _players: MunchkinPlayer[] = [];
	private _nextPlayerId: number = 1;

	get players(): MunchkinPlayer[] {
		return this._players;
	}

	set players(value: MunchkinPlayer[]) {
		this._players = value;
	}

	public async create(player: MunchkinPlayerData): Promise<MunchkinPlayer[]> {
		this._players = [
			...this._players,
			{
				...player,
				id: this._nextPlayerId++,
			},
		];
		return this._players;
	}

	public async update(player: MunchkinPlayer): Promise<MunchkinPlayer[]> {
		const index = this._players.findIndex(p => p.id === player.id);
		if (index < 0) {
			return this.create(player);
		}
		this._players = [...this._players];
		this._players[index] = player;
		return this._players;
	}

	public async delete(playerId: number): Promise<MunchkinPlayer[]> {
		this._players = this._players.filter(p => p.id !== playerId);
		return this._players;
	}

	abstract close(): void;
}
