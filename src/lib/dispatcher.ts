import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { Event, EventCreator, EventWithPropsCreator } from './event';

export const SOURCE_EVENT_TYPE = Symbol('');

@Injectable({ providedIn: 'root' })
export class Dispatcher {
  readonly #events$ = new Subject<Event>();

  dispatch(event: Event): void {
    this.#events$.next(event);
  }

  on(): Observable<Event>;
  on<EventCreators extends Array<EventCreator | EventWithPropsCreator>>(
    ...events: [...EventCreators]
  ): Observable<
    { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number]
  >;
  on(
    ...events: Array<EventCreator | EventWithPropsCreator>
  ): Observable<Event> {
    const eventTypes = events.reduce(
      (acc, { type }) => ({ ...acc, [type]: type }),
      {} as Record<string, string>,
    );

    return this.#events$.pipe(
      filter(({ type }) => !!eventTypes[type]),
      map((event) => ({ ...event, [SOURCE_EVENT_TYPE]: event.type })),
    );
  }
}
