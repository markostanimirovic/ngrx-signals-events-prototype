import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Observable, tap } from 'rxjs';
import {
  EmptyFeatureResult,
  Prettify,
  signalStoreFeature,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
  type,
  withHooks,
} from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { isEvent } from './event';
import { SOURCE_EVENT } from './events';

export function withEffects<Input extends SignalStoreFeatureResult>(
  effectsFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['props']>,
  ) => Record<string, Observable<unknown>>,
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return signalStoreFeature(
    type<Input>(),
    withHooks({
      onInit(store, dispatcher = inject(Dispatcher)) {
        const effectSources = effectsFactory(store);
        const effects: Observable<unknown>[] = [];

        for (const effectSource$ of Object.values(effectSources)) {
          const effect$ = effectSource$.pipe(
            tap((value) => {
              if (isEvent(value) && !(SOURCE_EVENT in value)) {
                dispatcher.dispatch(value);
              }
            }),
          );
          effects.push(effect$);
        }

        merge(...effects)
          .pipe(takeUntilDestroyed())
          .subscribe();
      },
    }),
  );
}
