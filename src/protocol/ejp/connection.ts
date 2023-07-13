import { Emitter, EventEmitter } from './emitter';
import { SjpSocket } from '../sjp/SjpSocket';

export type EjpMessage<T = any> = {
    data: T;
} & ({
    type: 'event'
    action: string;
} | {
    type: 'request';
    action: string;
    id: number;
} | {
    type: 'response';
    id: number;
})

export type EjpMessageType = 'event' | 'request' | 'response';

type PromiseCallback<T = void> = ConstructorParameters<typeof Promise<T>>[0];
type PromiseResolve<T = void> = Parameters<PromiseCallback<T>>[0];
type PromiseReject<T = void> = Parameters<PromiseCallback<T>>[1];

interface ReceiveQueueItem<Res = any> {
    id: number;
    timeoutId: ReturnType<typeof setTimeout>;
    resolve: PromiseResolve<Res>;
    reject: PromiseReject<Res>;
}

export class EjpConnection {
    public static isConnectionMessage(obj: any): obj is EjpMessage {
        return (
            typeof obj === 'object' && obj !== null &&
            ['event', 'request', 'response'].includes(obj.type) &&
            obj.data !== undefined
        );
    }

    public readonly requests: Emitter<Record<string, (data: any, id: number) => void>>;
    public readonly events: Emitter<Record<string, (data: any) => void>>;
    private readonly _socket: SjpSocket;
    private readonly _receiveQueue: ReceiveQueueItem[] = [];
    private _nextMessageId: number = 1;

    public constructor(socket: SjpSocket) {
        this.requests = new EventEmitter();
        this.events = new EventEmitter();
        this._socket = socket;
        this._init();
    }

    public get socket(): SjpSocket {
        return this._socket;
    }

    public async emit<Req>(action: string, data: Req): Promise<void> {
        await this._socket.send({
            type: 'event',
            action,
            data,
        });
    }

    public async request<Req, Res>(action: string, data: Req): Promise<Res> {
        const id = this._nextMessageId++;
        await this._socket.send({
            type: 'request',
            action,
            id,
            data,
        });
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject();
            }, 5000);
            this._receiveQueue.push({
                id, timeoutId, resolve, reject,
            });
        });
    }

    public async response<Req>(id: number, data: Req): Promise<void> {
        await this._socket.send({
            type: 'response',
            id,
            data,
        });
    }

    private _init(): void {
        this._socket.onMessage((msg) => {
            console.log('[CONNECTION] Received message', msg, EjpConnection.isConnectionMessage(msg));
            if (!EjpConnection.isConnectionMessage(msg)) {
                return;
            }

            if (msg.type === 'event') {
                this.events.emit(msg.action, msg.data);
            } else if (msg.type === 'request') {
                this.requests.emit(msg.action, msg.data, msg.id);
            } else if (msg.type === 'response') {
                const itemIndex = this._receiveQueue
                    .findIndex(i => i.id === msg.id);
                if (itemIndex < 0) {
                    return;
                }
                const item = this._receiveQueue[itemIndex];
                this._receiveQueue.slice(itemIndex, 1);
                clearTimeout(item.timeoutId);
                item.resolve(msg.data);
            }
        });
    }
}
