import GameModule, { GuestGameConstructor, HostGameConstructor, MunchkinPlayer } from './GameModule';
import { SessionControllerType } from '../../components/Session/SessionContext';

export default {
	getPlayers(): Promise<MunchkinPlayer[]> {
		console.log('[MANAGER] Getting players');
		return new Promise(resolve => {
			GameModule.getPlayers(players => resolve(players));
		});
	},
	setPlayers(players: MunchkinPlayer[]): Promise<void> {
		// TODO: Async
		return new Promise(resolve => {
			GameModule.setPlayers(players);
			resolve();
		});
	},
	getControllerType(): Promise<SessionControllerType> {
		console.log('[MANAGER] Getting controller type');
		return new Promise(resolve => {
			GameModule.getControllerType(type => resolve(type));
		});
	},
	startHostGame(data: HostGameConstructor): Promise<void> {
		console.log('[MANAGER] Starting host game');
		return new Promise((resolve, reject) => {
			GameModule.startHostGame(data, (error) => {
				console.log('[MANAGER] Started host game', error);
				return !error ? resolve() : reject(error);
			});
		});
	},
	startGuestGame(data: GuestGameConstructor): Promise<void> {
		console.log('[MANAGER] Starting guest game');
		return new Promise((resolve, reject) => {
			GameModule.startGuestGame(data, (error) => {
				console.log('[MANAGER] Started guest game', error);
				return !error ? resolve() : reject(error);
			});
		});
	},
	closeGame(): Promise<void> {
		console.log('[MANAGER] Closing game');
		return new Promise((resolve, reject) => {
			GameModule.closeGame((error) => {
				console.log('[MANAGER] Closed game', error);
				return !error ? resolve() : reject(error);
			});
		});
	},
};
