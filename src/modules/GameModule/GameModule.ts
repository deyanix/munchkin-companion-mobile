import { NativeModule, NativeModules } from 'react-native';
import { SessionControllerType } from '../../components/Session/SessionContext';

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

	startHostGame(data: HostGameConstructor, cb: (error?: string) => void): void;
	startGuestGame(data: GuestGameConstructor, cb: (error?: string) => void): void;
	closeGame(cb: (error?: string) => void): void;

	createPlayer(player: MunchkinPlayerData): void;
	updatePlayer(player: MunchkinPlayer): void;
	deletePlayer(playerId: number): void;

	getPlayers(cb: (data: MunchkinPlayer[]) => void): void;
	setPlayers(players: MunchkinPlayer[]): void;
	getControllerType(cb: (data: SessionControllerType) => void): void;
}

export default GameModule as GameModuleInterface;
