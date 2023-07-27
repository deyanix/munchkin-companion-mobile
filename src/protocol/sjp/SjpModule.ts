import { NativeModule, NativeModules } from 'react-native';

const {SjpModule} = NativeModules;

export interface DiscoveryServerConstructor {
	port: number;
	background?: boolean;
}

export interface DiscoveryClientConstructor {
	address: string;
	port: number;
	background?: boolean;
}

export interface ServerSocketConstructor {
	port: number;
	background?: boolean;
}

export interface SocketConstructor {
	address: string;
	port: number;
	background?: boolean;
}

export interface SjpInterface extends NativeModule {
	createDiscoveryServer(data: DiscoveryServerConstructor, cb: (id: number) => void): void;
	createDiscoveryClient(data: DiscoveryClientConstructor, cb: (id: number) => void): void;
	createServerSocket(data: ServerSocketConstructor, cb: (id: number) => void): void;
	createSocket(data: SocketConstructor, cb: (id: number) => void): void;
	startBackgroundService(): void;
	write(id: number, data: string): void;
	close(id: number): void;
}

export default SjpModule as SjpInterface;
