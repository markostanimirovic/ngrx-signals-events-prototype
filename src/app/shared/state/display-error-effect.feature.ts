import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { signalStoreFeature } from '@ngrx/signals';
import {
  Events,
  EventWithPropsCreator,
  withEffects,
} from '@ngrx/signals/events';

export function withDisplayErrorEffect(
  ...errorEvents: EventWithPropsCreator<string, { error: string }>[]
) {
  return signalStoreFeature(
    withEffects(
      (_, events = inject(Events), snackBar = inject(MatSnackBar)) => ({
        displayError$: events.on(...errorEvents).pipe(
          tap(({ error }) => {
            snackBar.open(error, 'Close', { duration: 5_000 });
          }),
        ),
      }),
    ),
  );
}
