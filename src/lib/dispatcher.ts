import { inject, Injectable } from '@angular/core';
import { Event } from './event';
import { Events, EVENTS, ReducerEvents } from './events';

@Injectable({ providedIn: 'root' })
export class Dispatcher {
  readonly #reducerEvents = inject(ReducerEvents);
  readonly #events = inject(Events);

  dispatch(event: Event): void {
    this.#reducerEvents[EVENTS].next(event);
    this.#events[EVENTS].next(event);
  }
}
