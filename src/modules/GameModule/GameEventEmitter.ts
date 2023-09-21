import { EventSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import { MunchkinDevice, MunchkinPlayer } from './GameModule';

export const GameNativeEventEmitter = new NativeEventEmitter(NativeModules.GameModule);

export interface GameDiscoveryItem {
	address: string;
	port: number;
	device: MunchkinDevice;
}

export default {
	onDiscovery(cb: (device: GameDiscoveryItem[]) => void): EventSubscription {
		return GameNativeEventEmitter.addListener('discovery', cb);
	},
	onError(cb: (message: string) => void): EventSubscription {
		return GameNativeEventEmitter.addListener('error', cb);
	},
	onClose(cb: () => void): EventSubscription {
		return GameNativeEventEmitter.addListener('close', cb);
	},
	onUpdatePlayer(cb: (players: MunchkinPlayer[]) => void): EventSubscription {
		return GameNativeEventEmitter.addListener('update-player', cb);
	},
};
