import { SjpServerSocket } from '../sjp/SjpServerSocket';
import { MunchkinDevice, WelcomeEvent } from './message';
import { EjpConnection } from '../ejp/connection';
import SjpManager from '../sjp/SjpManager';
import { SjpDiscoveryServer } from '../sjp/SjpDiscoveryServer';

export class MunchkinServer {
	public static async start(port: number, device: MunchkinDevice): Promise<MunchkinServer> {
		const [discoveryServer, serverSocket] = await Promise.all([
			SjpManager.createDiscoveryServer(({port})),
			SjpManager.createServerSocket({port}),
		]);

		return new MunchkinServer(discoveryServer, serverSocket, device);
	}

	private static readonly VERSION = '1.0';
	private _discoveryServer: SjpDiscoveryServer;
	private _serverSocket: SjpServerSocket;
	private _device: MunchkinDevice;

	public constructor(discoveryServer: SjpDiscoveryServer, serverSocket: SjpServerSocket, device: MunchkinDevice) {
		this._discoveryServer = discoveryServer;
		this._serverSocket = serverSocket;
		this._device = device;
		this._setup();
	}

	public close() {
		this._serverSocket.close();
		this._discoveryServer.close();
	}

	private _setup() {
		this._serverSocket.onConnect(async (socket) => {
			const connection = new EjpConnection(socket);
			await connection.emit<WelcomeEvent>('welcome', {
				device: this._device,
				version: MunchkinServer.VERSION,
			});

			connection.requests.on('join', (event, id) => {
				console.log('[SERVER] Join event ', event);
				connection.response(id, {result: true});
			});
		});
	}
}
