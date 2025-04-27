import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, tap } from 'rxjs';
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
import { Event, EventCreator, EventWithPropsCreator } from './event';
import { ReducerEvents } from './events';

export function withReducer<State extends object>(
  ...caseReducers: CaseReducerResult<
    State,
    Array<EventCreator | EventWithPropsCreator>
  >[]
): SignalStoreFeature<
  { state: State; props: {}; methods: {} },
  EmptyFeatureResult
> {
  return signalStoreFeature(
    { state: type<State>() },
    withHooks({
      onInit(store, events = inject(ReducerEvents)) {
        const updates = caseReducers.map((caseReducer) =>
          events.on(...caseReducer.events).pipe(
            tap((event: Event) => {
              const state = getState(store);
              const result = caseReducer.reducer(event, state);
              const updaters = Array.isArray(result) ? result : [result];

              patchState(store, ...updaters);
            }),
          ),
        );

        merge(...updates)
          .pipe(takeUntilDestroyed())
          .subscribe();
      },
    }),
  );
}
