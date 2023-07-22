import SjpModule, {
	DiscoveryClientConstructor,
	DiscoveryServerConstructor,
	ServerSocketConstructor,
	SocketConstructor
} from './SjpModule';
import { SjpDiscoveryServer } from './SjpDiscoveryServer';
import { SjpDiscoveryClient } from './SjpDiscoveryClient';
import { SjpServerSocket } from './SjpServerSocket';
import { SjpSocket } from './SjpSocket';
import { NativeEventEmitter, NativeModules } from 'react-native';

export const SjpEventEmitter = new NativeEventEmitter(NativeModules.SjpModule);

class SjpManager {
	async createDiscoveryServer(data: DiscoveryServerConstructor): Promise<SjpDiscoveryServer> {
		return new Promise(resolve => {
			SjpModule.createDiscoveryServer(data, (id) => {
				console.log('[MANAGER] Discovery server', data, id);
				resolve(new SjpDiscoveryServer(id));
			});
		});
	}

	async createDiscoveryClient(data: DiscoveryClientConstructor): Promise<SjpDiscoveryClient> {
		return new Promise(resolve => {
			SjpModule.createDiscoveryClient(data, (id) => {
				console.log('[MANAGER] Discovery client', data, id);
				resolve(new SjpDiscoveryClient(id));
			});
		});
	}

	async createServerSocket(data: ServerSocketConstructor): Promise<SjpServerSocket> {
		return new Promise(resolve => {
			SjpModule.createServerSocket(data, (id) => {
				console.log('[MANAGER] Server socket', data, id);
				resolve(new SjpServerSocket(id));
			});
		});
	}

	async createSocket(data: SocketConstructor): Promise<SjpSocket> {
		return new Promise(resolve => {
			SjpModule.createSocket(data, (id) => {
				console.log('[MANAGER] Socket', data, id);
				resolve(new SjpSocket(id));
			});
		});
	}

	async createBackgroundServerSocket(data: ServerSocketConstructor): Promise<SjpServerSocket> {
		return new Promise(resolve => {
			SjpModule.createBackgroundServerSocket(data);
			const cancel = SjpEventEmitter.addListener('start', (event) => {
				resolve(new SjpServerSocket(event.socketId));
				cancel.remove();
			});
		});
	}
}

export default new SjpManager();
