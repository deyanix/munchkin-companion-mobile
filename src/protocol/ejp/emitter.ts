export type EventMap = Record<string, (...args: any[]) => any>;

export type EventKey<Map = EventMap> = keyof Map;

export type EventCallbackParameters<
    Map = EventMap,
    Key = EventKey<Map>
> = Key extends EventKey<Map> ?
  Map[Key] extends (...args: infer Params) => any ? Params : any
  : any;

export type EventReceiver<
    Map = EventMap,
    Key = EventKey<Map>
> = Key extends EventKey<Map> ? (...args: EventCallbackParameters<Map, Key>) => void : any

export type EventEmit<
    Map = EventMap,
    Key extends EventKey<Map> = EventKey<Map>
> = (event: Key, ...args: EventCallbackParameters<Map, Key>) => void

export interface Emitter<Map = EventMap> {
    on<K extends EventKey<Map> | string>(eventName: K, fn: EventReceiver<Map, K>): void;
    off<K>(eventName: K, fn: EventReceiver<Map, K>): void;
    emit: EventEmit<Map>;
}

export type EmitterListeners<Map = EventMap> = {
    [key in any]: key extends EventKey<Map> ? EventReceiver<Map, key>[] : any
}

// I'm sorry for any, but TypeScript doesn't like me... It's not my fault. Really.
export class EventEmitter<Map = EventMap> implements Emitter<Map> {
    private listeners: EmitterListeners<Map> = {};

    on<K extends EventKey<Map> | string>(eventName: K, fn: EventReceiver<Map, K>): void {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [] as any;
        }
        this.listeners[eventName]?.push(fn as any);
    }

    off<K>(eventName: K, fn: EventReceiver<Map, K>): void {
        const eventListeners = this.listeners[eventName as any];
        if (!eventListeners) {
            return;
        }

        const index = eventListeners.indexOf(fn as any);
        if (index < 0) {
            return;
        }

        eventListeners.splice(index, 1);
    }

    emit<K extends EventKey<Map>>(event: K, ...args: EventCallbackParameters<Map, K>): void {
        this.listeners[event]?.forEach(fn => fn(...args));
    }
}
