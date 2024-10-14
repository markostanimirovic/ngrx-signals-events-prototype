import { Injectable } from '@angular/core';
import {
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import { Event, EventCreator, EventWithPropsCreator } from './event';

export const EVENTS = Symbol();
export const SOURCE_EVENT = Symbol();

abstract class BaseEvents {
  /**
   * @internal
   */
  readonly [EVENTS] = new Subject<Event>();

  on(): Observable<Event>;
  on<EventCreators extends Array<EventCreator | EventWithPropsCreator>>(
    ...events: [...EventCreators]
  ): Observable<
    { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number]
  >;
  on(
    ...events: Array<EventCreator | EventWithPropsCreator>
  ): Observable<Event> {
    return this[EVENTS].pipe(filterByType(events), withSourceEvent());
  }
}

@Injectable({ providedIn: 'root' })
export class Events extends BaseEvents {}

@Injectable({ providedIn: 'root' })
export class ReducerEvents extends BaseEvents {}

function filterByType<T extends Event>(
  events: Array<EventCreator | EventWithPropsCreator>,
): MonoTypeOperatorFunction<T> {
  if (events.length === 0) {
    return (source$) => source$;
  }

  const eventTypes = toEventTypes(events);
  return filter<T>(({ type }) => !!eventTypes[type]);
}

function toEventTypes(
  events: Array<EventCreator | EventWithPropsCreator>,
): Record<string, string> {
  return events.reduce(
    (acc, { type }) => ({ ...acc, [type]: type }),
    {} as Record<string, string>,
  );
}

function withSourceEvent<T extends Event>(): MonoTypeOperatorFunction<T> {
  return map(({ ...event }) => {
    Object.defineProperty(event, SOURCE_EVENT, { value: event.type });
    return event;
  });
}
