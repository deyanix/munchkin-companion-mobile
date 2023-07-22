import { NativeModule, NativeModules } from 'react-native';

const {SjpModule} = NativeModules;

export interface DiscoveryServerConstructor {
	port: number
}

export interface DiscoveryClientConstructor {
	address: string;
	port: number;
}

export interface ServerSocketConstructor {
	port: number;
}

export interface SocketConstructor {
	address: string;
	port: number;
}

export interface SjpInterface extends NativeModule {
	createDiscoveryServer(data: DiscoveryServerConstructor, cb: (id: number) => void): void;
	createDiscoveryClient(data: DiscoveryClientConstructor, cb: (id: number) => void): void;
	createServerSocket(data: ServerSocketConstructor, cb: (id: number) => void): void;
	createSocket(data: SocketConstructor, cb: (id: number) => void): void;
	write(id: number, data: string): void;
	close(id: number): void;
	download(url: string): void;
}

export default SjpModule as SjpInterface;
