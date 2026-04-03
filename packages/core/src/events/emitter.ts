import { logger } from '../logger.js';
import { EventListener, EventType, ExtractPayload } from './types.js';

export class EvaliphyEmitter {
  private listeners = new Map<EventType, Set<EventListener<any>>>();

  /**
   * Subscribe to an event. Returns an unsubscribe function.
   */
  on<T extends EventType>(event: T, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  /**
   * Subscribe to an event for one emission only.
   */
  once<T extends EventType>(event: T, listener: EventListener<T>): () => void {
    const onceListener: EventListener<T> = async (payload) => {
      this.off(event, onceListener);
      return await listener(payload);
    };

    return this.on(event, onceListener);
  }

  /**
   * Unsubscribe from an event.
   */
  off<T extends EventType>(event: T, listener: EventListener<T>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event. Awaits all listeners and isolates errors.
   */
  async emit<T extends EventType>(
    event: T,
    payload: ExtractPayload<T>
  ): Promise<void> {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      return;
    }

    // Convert to array to ensure registration order and prevent issues if listeners are removed during iteration
    const listenersToInvoke = Array.from(eventListeners);

    for (const listener of listenersToInvoke) {
      try {
        await listener(payload);
      } catch (err) {
        logger.error({ err, event, payload }, 'Listener failed');
        // Never rethrows - run continues
      }
    }
  }

  /**
   * Clear listeners for one event or all events.
   */
  removeAll(event?: EventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

/**
 * Singleton instance for phase-1
 */
export const emitter = new EvaliphyEmitter();
