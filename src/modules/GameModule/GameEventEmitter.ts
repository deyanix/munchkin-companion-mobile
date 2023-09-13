import { EventSubscription, NativeEventEmitter, NativeModules } from 'react-native';

export const GameNativeEventEmitter = new NativeEventEmitter(NativeModules.GameModule);

export default {
	onDiscovery(cb: (device: {address: string, port: number}) => void): EventSubscription {
		return GameNativeEventEmitter.addListener('discovery', cb);
	},
	onError(cb: (message: string) => void): EventSubscription {
		return GameNativeEventEmitter.addListener('error', cb);
	},
};
