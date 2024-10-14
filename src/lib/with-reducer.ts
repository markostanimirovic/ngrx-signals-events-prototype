import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import {
  EmptyFeatureResult,
  getState,
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
} from '@ngrx/signals';
import { CaseReducerResult } from './case-reducer';
import { EventCreator, EventWithPropsCreator } from './event';
import { ReducerEvents } from './events';

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
      onInit(store, events = inject(ReducerEvents)) {
        for (const caseReducerResult of caseReducers) {
          events
            .on(...caseReducerResult.events)
            .pipe(
              tap((event: Event) => {
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
