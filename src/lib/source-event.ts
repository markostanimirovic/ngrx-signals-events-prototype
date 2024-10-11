import { map, MonoTypeOperatorFunction } from 'rxjs';
import { Event } from './event';

export const SOURCE_EVENT = Symbol();

export function withSourceEvent<
  T extends Event,
>(): MonoTypeOperatorFunction<T> {
  return map(({ ...event }) => {
    Object.defineProperty(event, SOURCE_EVENT, { value: event.type });
    return event;
  });
}
