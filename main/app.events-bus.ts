import { EventEmitter } from "events";
import { EAppEventListenerChannels, EAppEvents } from "./constants";
import { Singleton } from "./decorators";
import { IAppEventPayloads } from "./interfaces";

@Singleton
export class AppEventBus extends EventEmitter {
  private activeListeners: Map<
    EAppEvents,
    Map<EAppEventListenerChannels, Function>
  > = new Map();
  private constructor() {
    super();
  }

  public emit<E extends keyof IAppEventPayloads>(
    event: E,
    ...args: [IAppEventPayloads[E]]
  ): boolean {
    if (!this._hasActiveListener(event))
      throw new Error(`No active listener for event: ${event}`);

    return super.emit(event, ...args);
  }

  public on<E extends keyof IAppEventPayloads>(
    channel: EAppEventListenerChannels,
    event: E,
    listener: (arg: IAppEventPayloads[E]) => void,
  ): this {
    this._addActiveListener(event, channel, listener);
    return super.on(event, listener);
  }

  public once<E extends keyof IAppEventPayloads>(
    event: E,
    listener: (arg: IAppEventPayloads[E]) => void,
  ): this {
    return super.once(event, listener);
  }

  public off<E extends keyof IAppEventPayloads>(
    channel: EAppEventListenerChannels,
    event: E,
  ): this {
    const listener = this._getActiveListener(event, channel);
    this._removeActiveListener(event, channel);
    return super.off(event, listener);
  }

  private _addActiveListener(
    event: EAppEvents,
    channel: EAppEventListenerChannels,
    listener: Function,
  ): void {
    if (!this.activeListeners.has(event)) {
      this.activeListeners.set(event, new Map());
    }

    this.activeListeners.get(event)?.set(channel, listener);
  }

  private _removeActiveListener(
    event: EAppEvents,
    channel: EAppEventListenerChannels,
  ): void {
    this.activeListeners.get(event)?.delete(channel);
  }

  private _getActiveListener(
    event: EAppEvents,
    channel: EAppEventListenerChannels,
  ): Function | undefined {
    return this.activeListeners.get(event)?.get(channel);
  }

  private _hasActiveListener(event: EAppEvents): boolean {
    return this.activeListeners.get(event)?.size > 0;
  }
}
