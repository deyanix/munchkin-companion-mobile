import {NativeModules} from 'react-native';
const {SjpModule} = NativeModules;

export interface SjpInterface {
	createDiscoveryServer(id: number, data: {port: number}): void;
	createDiscoveryClient(id: number, data: {address: string, port: number}): void;
	close(id: number): void;
}

export default SjpModule as SjpInterface;
