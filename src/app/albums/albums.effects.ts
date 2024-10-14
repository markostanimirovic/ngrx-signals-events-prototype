import { inject } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState } from '@ngrx/signals/entities';
import { withEffects, Events } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { withDisplayErrorEffect } from '@/shared/state/display-error-effect.feature';
import { Album } from './album.model';
import { AlbumsService } from './albums.service';
import { albumsApiEvents } from './albums.events';
import { albumSearchPageEvents } from './album-search/album-search.events';
import { albumOverviewPageEvents } from './album-overview/album-overview.events';

export function withAlbumsEffects() {
  return signalStoreFeature(
    { state: type<EntityState<Album>>() },
    withEffects(
      (
        { entityMap },
        events = inject(Events),
        albumsService = inject(AlbumsService),
      ) => ({
        loadAll$: events.on(albumSearchPageEvents.opened).pipe(
          switchMap(() =>
            albumsService.getAll().pipe(
              mapResponse({
                next: (albums) => albumsApiEvents.loadedSuccess({ albums }),
                error: (error: { message: string }) =>
                  albumsApiEvents.loadedError({ error: error.message }),
              }),
            ),
          ),
        ),
        loadByIdIfNotLoaded$: events.on(albumOverviewPageEvents.idChanged).pipe(
          filter(({ albumId }) => !entityMap()[albumId]),
          switchMap(({ albumId }) =>
            albumsService.getById(albumId).pipe(
              mapResponse({
                next: (album) => albumsApiEvents.loadedByIdSuccess({ album }),
                error: (error: { message: string }) =>
                  albumsApiEvents.loadedByIdError({ error: error.message }),
              }),
            ),
          ),
        ),
      }),
    ),
    withDisplayErrorEffect(
      albumsApiEvents.loadedError,
      albumsApiEvents.loadedByIdError,
    ),
  );
}
