import net from 'react-native-tcp-socket';
import {MunchkinSocket} from "../common/socket";
import {Logger} from "../common/logger";
import {MunchkinConnection} from "../common/connection";
import {MunchkinGame, MunchkinGender, MunchkinPlayer, MunchkinPlayerData} from "../common/game";
import { MunchkinDevice, WelcomeEvent } from '../common/message';

export interface MunchkinClientOptions {
    timeout: number;
}

export enum MunchkinClientStatus {
    INITIALIZED,
    CONNECTING,
    CONNECTED,
    DISCONNECTED
}

export class MunchkinClient {
    public static readonly VERSION = '1.0';
    private readonly _socket: net.Socket;
    private readonly _munchkinSocket: MunchkinSocket;
    private readonly _munchkinConnection: MunchkinConnection;
    private readonly _options: MunchkinClientOptions;
    private readonly _logger: Logger;
    private readonly _game: MunchkinGame;
    private _status: MunchkinClientStatus;

    public constructor(options: MunchkinClientOptions) {
        this._socket = new net.Socket();
        this._logger = new Logger('CLIENT');
        this._options = options;
        this._munchkinSocket = new MunchkinSocket(
            this._socket,
            {timeout: options.timeout}
        );
        this._munchkinConnection = new MunchkinConnection(this._munchkinSocket);
        this._game = new MunchkinGame();
        this._status = MunchkinClientStatus.INITIALIZED;
    }

    get game(): MunchkinGame {
        return this._game;
    }

    connect(port: number, host: string): Promise<MunchkinDevice | undefined> {
        if (this._status === MunchkinClientStatus.CONNECTING) {
            return Promise.reject(new Error('Currently client is trying connect'));
        }

        this._status = MunchkinClientStatus.CONNECTING;
        return new Promise((resolve) => {
            this._logger.log('Connecting');
            const timeoutId = setTimeout(() => {
                this._logger.log('Timeout');
                resolve(undefined);
                this._socket.end();
                this._socket.destroy();
            }, this._options.timeout);

            this._socket.connect({port, host}, async () => {
                this._status = MunchkinClientStatus.CONNECTED;
                this._logger.log('Connected!');

                this._munchkinConnection.events.on('welcome', (data: WelcomeEvent) => {
                    this._logger.log('welcome', host, port, data);
                    clearTimeout(timeoutId);
                    resolve(data.device);
                });

                this._munchkinConnection.events.on('players/synchronize', (data: MunchkinPlayer[]) => {
                    this._game.players = data;
                });

                // const status = await this._munchkinConnection.request('join', {
                //     version: MunchkinClient.VERSION,
                // });
                // this._logger.log('Connection status', status);

                // this._game.players = await this._munchkinConnection.request<MunchkinPlayerData, MunchkinPlayer[]>('players/create', {
                //     name: 'Test',
                //     gear: 0,
                //     level: 1,
                //     gender: MunchkinGender.MALE,
                //     genderChanged: true,
                // });
            });
        })

    }

}
