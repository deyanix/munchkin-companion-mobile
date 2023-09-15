import { NativeModule, NativeModules } from 'react-native';

const {GameModule} = NativeModules;

export interface DiscoveryClientConstructor {
	address: string;
	port: number;
}

export interface HostGameConstructor {
	port: number;
}

export interface GuestGameConstructor {
	address: string;
	port: number;
}

export type MunchkinGender = 'MALE' | 'FEMALE';

export interface MunchkinPlayerData {
	name: string;
	level: number;
	gear: number;
	gender: MunchkinGender;
	genderChanged: boolean;
}

export interface MunchkinPlayer extends MunchkinPlayerData {
	id: number;
}

export interface MunchkinDevice {
	manufacturer: string;
	model: string;
}

export interface GameModuleInterface extends NativeModule {
	startDiscovery(data: DiscoveryClientConstructor): void;
	closeDiscovery(): void;

	startHostGame(data: HostGameConstructor): void;
	startGuestGame(data: GuestGameConstructor): void;
	closeGame(): void;

	createPlayer(player: MunchkinPlayerData): void;
	updatePlayer(player: MunchkinPlayer): void;
	deletePlayer(playerId: number): void;
	getPlayers(cb: () => MunchkinPlayer[]): void;
}

export default GameModule as GameModuleInterface;
