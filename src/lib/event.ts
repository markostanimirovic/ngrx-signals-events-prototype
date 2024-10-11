import { Prettify } from '@ngrx/signals';

export type Event<Type extends string = string> = {
  type: Type;
};

export type EventWithProps<
  Type extends string = string,
  Props extends object = object,
> = Event<Type> & Props;

export type EventCreator<Type extends string = string> = (() => Event<Type>) &
  Event<Type>;

export type EventWithPropsCreator<
  Type extends string = string,
  Props extends object = any,
> = ((props: Props) => EventWithProps<Type, Props>) & Event<Type>;

type EventType<
  Source extends string,
  EventName extends string,
> = `[${Source}] ${EventName}`;

type EventGroup<
  Source extends string,
  Events extends Record<string, object | void>,
> = {
  [EventName in keyof Events]: EventName extends string
    ? Events[EventName] extends void
      ? EventCreator<EventType<Source, EventName>>
      : Events[EventName] extends object
        ? EventWithPropsCreator<EventType<Source, EventName>, Events[EventName]>
        : never
    : never;
};

export function event<Type extends string>(type: Type): EventCreator<Type>;
export function event<Type extends string, Props extends object>(
  type: Type,
  props: Props,
): EventWithPropsCreator<Type, Props>;
export function event(type: string): EventCreator | EventWithPropsCreator {
  const creator = (props?: object) => ({ type, ...props });
  (creator as any).type = type;

  return creator as EventCreator | EventWithPropsCreator;
}

export function eventGroup<
  Source extends string,
  Events extends Record<string, object | void>,
>(config: {
  source: Source;
  events: Events;
}): Prettify<EventGroup<Source, Events>> {
  return Object.entries(config.events).reduce(
    (acc, [eventName, props]) => {
      const eventType = `[${config.source}] ${eventName}`;
      return {
        ...acc,
        [eventName]: props ? event(eventType, props) : event(eventType),
      };
    },
    {} as EventGroup<Source, Events>,
  );
}

export function isEvent(value: unknown): value is Event {
  return typeof value === 'object' && value !== null && 'type' in value;
}
