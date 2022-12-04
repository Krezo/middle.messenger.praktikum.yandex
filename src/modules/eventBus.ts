class EventBus<E extends Record<string | symbol, unknown[]>> {
  constructor(private readonly listeners: {
    [K in keyof E]?: Array<(...args: unknown[]) => void>
  } = {}) { }

  on<K extends keyof E>(event: K, callback: (...args: E[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(callback);
  }

  off<K extends keyof E>(event: K, callback: (...args: E[K]) => void) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event.toString()}`);
    }

    this.listeners[event] = this.listeners[event]!.filter(
      listener => listener !== callback
    );
  }

  emit(event: keyof E, ...args: unknown[]) {
    if (!this.listeners[event]) {
      throw new Event(`Нет события: ${event.toString()}`);
    }
    this.listeners[event]!.forEach(listener => {
      listener(...args);
    });
  }
}

export {
  EventBus
}
