import { inject } from '@angular/core';
import { exhaustMap } from 'rxjs';
import { signalStoreFeature } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { withDisplayErrorEffect } from '@/shared/state/display-error-effect.feature';
import { ArtistsService } from './artists.service';
import { artistsApiEvents, artistsPageEvents } from './artists.events';

export function withArtistsEffects() {
  return signalStoreFeature(
    withEffects(
      (
        _,
        events = inject(Events),
        artistsService = inject(ArtistsService),
      ) => ({
        loadAll$: events
          .on(artistsPageEvents.opened, artistsPageEvents.refreshed)
          .pipe(
            exhaustMap(() =>
              artistsService.getAll().pipe(
                mapResponse({
                  next: (artists) =>
                    artistsApiEvents.loadedSuccess({ artists }),
                  error: (error: { message: string }) =>
                    artistsApiEvents.loadedError({ error: error.message }),
                }),
              ),
            ),
          ),
      }),
    ),
    withDisplayErrorEffect(artistsApiEvents.loadedError),
  );
}
