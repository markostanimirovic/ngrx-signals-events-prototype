import { PartialStateUpdater } from '@ngrx/signals';
import { EventCreator, EventWithPropsCreator } from './event';

export type CaseReducerResult<
  State extends object,
  EventCreators extends Array<EventCreator | EventWithPropsCreator>,
> = {
  reducer: CaseReducer<State, EventCreators>;
  events: EventCreators;
};

type CaseReducer<
  State extends object,
  EventCreators extends Array<EventCreator | EventWithPropsCreator>,
> = (
  event: { [K in keyof EventCreators]: ReturnType<EventCreators[K]> }[number],
  state: State,
) =>
  | Partial<State>
  | PartialStateUpdater<State>
  | Array<Partial<State> | PartialStateUpdater<State>>;

export function on<
  State extends object,
  EventCreators extends Array<EventCreator | EventWithPropsCreator>,
>(
  ...args: [
    ...events: [...EventCreators],
    reducer: CaseReducer<NoInfer<State>, NoInfer<EventCreators>>,
  ]
): CaseReducerResult<State, EventCreators> {
  const reducer = args.pop() as CaseReducer<State, EventCreators>;
  const events = args as unknown as EventCreators;

  return { reducer, events };
}
