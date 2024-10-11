import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import {
  EmptyFeatureResult,
  getState,
  PartialStateUpdater,
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
} from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { EventCreator, EventWithPropsCreator } from './event';

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

type CaseReducerResult<
  State extends object,
  EventCreators extends Array<EventCreator | EventWithPropsCreator>,
> = {
  reducer: CaseReducer<State, EventCreators>;
  events: EventCreators;
};

export function when<
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

export function withReducer<State extends object>(
  ...caseReducers: CaseReducerResult<
    State,
    Array<EventCreator | EventWithPropsCreator>
  >[]
): SignalStoreFeature<
  { state: State; computed: {}; methods: {} },
  EmptyFeatureResult
> {
  return signalStoreFeature(
    { state: type<State>() },
    withHooks({
      onInit(store, dispatcher = inject(Dispatcher)) {
        for (const caseReducerResult of caseReducers) {
          dispatcher
            .on(...caseReducerResult.events)
            .pipe(
              tap((event) => {
                const state = getState(store);
                const result = caseReducerResult.reducer(event, state);
                const updaters = Array.isArray(result) ? result : [result];

                patchState(store, ...updaters);
              }),
              takeUntilDestroyed(),
            )
            .subscribe();
        }
      },
    }),
  );
}
