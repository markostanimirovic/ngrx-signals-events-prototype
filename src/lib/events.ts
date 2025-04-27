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
export const SOURCE_TYPE = Symbol();

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
    return this[EVENTS].pipe(filterByType(events), withSourceType());
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

  const eventMap = toEventCreatorMap(events);
  return filter<T>(({ type }) => !!eventMap[type]);
}

function toEventCreatorMap(
  events: Array<EventCreator | EventWithPropsCreator>,
): Record<string, EventCreator | EventWithPropsCreator> {
  return events.reduce((acc, event) => ({ ...acc, [event.type]: event }), {});
}

function withSourceType<T extends Event>(): MonoTypeOperatorFunction<T> {
  return map(({ ...event }) => {
    Object.defineProperty(event, SOURCE_TYPE, { value: event.type });
    return event;
  });
}
