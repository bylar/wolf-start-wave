
export interface Description { [key: string]: any }

export class EventInType<T extends Description = Description> {
  protected _listeners: Map<string, Array<Function>> = new Map;
  protected _selfListeners: Array<Function> = [];
  protected _listenerMaxSize = 0;

  addListener<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    this._listeners.has(eventName) || this._listeners.set(eventName, [])
    this._listeners.get(eventName)?.push(listener)
    return this;
  }
  on<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    return this.addListener(eventName, listener);
  }
  removeListener<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    if (this._listeners.has(eventName) && this._listeners.get(eventName)?.includes(listener)) {
      this._listeners.get(eventName)?.splice(this._listeners.get(eventName)?.indexOf(listener)!, 1)
    }
    return this;
  }
  once<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    const onceListener = (arg: T[N]) => {
      listener(arg)
      this.removeListener(eventName, onceListener);
    }
    return this.addListener(eventName, onceListener);
  }
  off<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    return this.removeListener(eventName, listener)
  }
  removeAllListeners(eventName?: keyof T & string | undefined): this {
    (eventName) ? this._listeners.delete(eventName) : this._listeners.clear();
    return this;
  }
  listeners(eventName: keyof T & string): Function[] {
    return this._listeners.has(eventName) ? this._listeners.get(eventName)! : [];
  }
  beforeEmit(callback: (eventName: keyof T & string, arg: T[keyof T & string]) => void) {
    this._selfListeners.push(callback);
  }
  emit<N extends keyof T & string>(eventName: N, arg?: T[N], through = false): boolean {
    !through && this._selfListeners.forEach(callback => setTimeout(() => callback(eventName, arg)));
    const callbackList = this.listeners(eventName);
    callbackList.forEach(callback => setTimeout(() => callback(arg)));
    return true;
  }
  listenerCount(eventName: keyof T & string): number {
    return this._listeners.has(eventName) ? this._listeners.get(eventName)?.length! : 0;
  }
  prependListener<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    this._listeners.has(eventName) || this._listeners.set(eventName, [])
    this._listeners.get(eventName)?.unshift(listener)
    return this;
  }
  prependOnceListener<N extends keyof T & string>(eventName: N, listener: (arg: T[N]) => void): this {
    const onceListener = (arg: T[N]) => {
      listener(arg)
      this.removeListener(eventName, onceListener);
    }
    return this.prependListener(eventName, onceListener);
  }
  setMaxListeners(n: number): this {
    return (this._listenerMaxSize = n), this;
  }
  getMaxListeners(): number {
    return this._listenerMaxSize;
  }
  rawListeners(eventName: string): Function[] {
    return this.listeners(eventName);
  }
  eventNames(): string[] {
    return [...this._listeners.keys()];
  }
}
