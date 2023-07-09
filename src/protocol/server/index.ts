import net from 'react-native-tcp-socket';
import {Logger} from '../common/logger';
import {MunchkinSocket} from '../common/socket';
import {MunchkinConnection} from '../common/connection';
import {MunchkinGame} from '../common/game';
import {MunchkinEmitter} from '../common/emitter';
import { MunchkinDevice, WelcomeEvent } from '../common/message';

export interface MunchkinServerOptions {
    timeout: number;
    device: MunchkinDevice;
}

export class MunchkinServer extends MunchkinEmitter {
    public static readonly VERSION = '1.0';
    private readonly _server: net.Server;
    private readonly _options: MunchkinServerOptions;
    private readonly _logger: Logger;
    private readonly _connections: MunchkinConnection[] = [];
    private readonly _game: MunchkinGame;

    public constructor(options: MunchkinServerOptions) {
        super();
        this._logger = new Logger('SERVER');
        this._server = this._createServer();
        this._options = options;
        this._game = new MunchkinGame();
    }

    get game(): MunchkinGame {
        return this._game;
    }

    get connections(): MunchkinConnection[] {
        return this._connections;
    }

    public start(port: number, host: string = '0.0.0.0'): void {
        this._server.listen({port, host, reuseAddress: true});
        this._server.on('listening', () => {
            this._logger.log('Started server', host, port);
        })
        this._server.on('error',  (err) => {
            this._logger.catch(err);
        })
    }

    public stop(): void {
        this._logger.log('Closed server');
        this._server.close();
    }

    private _createServer(): net.Server {
        this._logger.log('Created server');
        return net.createServer((socket) => {
            this._logger.log('Connected.');
            const munchkinSocket = new MunchkinSocket(
                socket,
                {timeout: this._options.timeout}
            );

            munchkinSocket.on('close', () => {
                this._logger.log('Disconnected!');
                this._connections.splice(this._connections.indexOf(munchkinConnection), 1);
                this.emit('change');
            });

            const munchkinConnection = new MunchkinConnection(munchkinSocket);


            this._setupConnection(munchkinConnection);
            this._connections.push(munchkinConnection);
            this.emit('change');
        });
    }

    private async _setupConnection(connection: MunchkinConnection): Promise<void> {
        await connection.emit<WelcomeEvent>('welcome', {
            version: MunchkinServer.VERSION,
            device: this._options.device,
        });

        // connection.requests.on('join', (data, id) => {
        //     connection.response(id, {status: 'accepted'});
        // });
        //
        // connection.requests.on('players/create', (data, id) => {
        //     this._game.createPlayer(data);
        //     connection.response(id, this._game.players);
        //     this._connections
        //         .filter(conn => conn !== connection)
        //         .forEach(conn => conn.emit('players/synchronize', this._game.players));
        // });
    }
}
