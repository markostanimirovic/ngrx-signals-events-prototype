import { assertInInjectionContext, inject, Injector } from '@angular/core';
import { Prettify } from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { EventCreator, EventWithPropsCreator } from './event';

type InjectDispatchResult<
  EventGroup extends Record<string, EventCreator | EventWithPropsCreator>,
> = {
  [EventName in keyof EventGroup]: Parameters<EventGroup[EventName]> extends [
    infer Props,
  ]
    ? (props: Props) => void
    : () => void;
};

export function injectDispatch<
  EventGroup extends Record<string, EventCreator | EventWithPropsCreator>,
>(
  events: EventGroup,
  config?: { injector?: Injector },
): Prettify<InjectDispatchResult<EventGroup>> {
  if (!config?.injector) {
    assertInInjectionContext(injectDispatch);
  }

  const injector = config?.injector ?? inject(Injector);
  const dispatcher = injector.get(Dispatcher);

  return Object.entries(events).reduce(
    (acc, [eventName, eventCreator]) => ({
      ...acc,
      [eventName]: (props?: object) => dispatcher.dispatch(eventCreator(props)),
    }),
    {} as InjectDispatchResult<EventGroup>,
  );
}
