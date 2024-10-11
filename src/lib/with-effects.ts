import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
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
import { isEvent } from './event';
import { Dispatcher } from './dispatcher';
import { SOURCE_EVENT } from './source-event';

export function withEffects<Input extends SignalStoreFeatureResult>(
  effectsFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['computed']>,
  ) => Record<string, Observable<unknown>>,
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return signalStoreFeature(
    type<Input>(),
    withHooks({
      onInit(store, dispatcher = inject(Dispatcher)) {
        const effects = effectsFactory(store);
        for (const effect of Object.values(effects)) {
          effect
            .pipe(
              tap((value) => {
                if (isEvent(value) && !(SOURCE_EVENT in value)) {
                  dispatcher.dispatch(value);
                }
              }),
              takeUntilDestroyed(),
            )
            .subscribe();
        }
      },
    }),
  );
}
