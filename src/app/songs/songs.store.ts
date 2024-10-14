import { inject } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { signalStore, withState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { Events, when, withEffects, withReducer } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@/shared/state/request-status.feature';
import { withDisplayErrorEffect } from '@/shared/state/display-error-effect.feature';
import { albumOverviewPageEvents } from '@/albums/album-overview/album-overview.events';
import { Song } from './song.model';
import { songsApiEvents } from './songs.events';
import { SongsService } from './songs.service';

export const SongsStore = signalStore(
  { providedIn: 'root' },
  withState({ songsByAlbumMap: {} as Record<string, number[]> }),
  withEntities<Song>(),
  withRequestStatus(),
  withReducer(
    when(
      albumOverviewPageEvents.idChanged,
      ({ albumId }, { songsByAlbumMap }) =>
        songsByAlbumMap[albumId] ? {} : setPending(),
    ),
    when(
      songsApiEvents.loadedByAlbumIdSuccess,
      ({ songs, albumId }, { songsByAlbumMap }) => [
        setEntities(songs),
        setFulfilled(),
        {
          songsByAlbumMap: {
            ...songsByAlbumMap,
            [albumId]: songs.map(({ id }) => id),
          },
        },
      ],
    ),
    when(songsApiEvents.loadedByAlbumIdError, ({ error }) => setError(error)),
  ),
  withEffects(
    (
      { songsByAlbumMap },
      events = inject(Events),
      songsService = inject(SongsService),
    ) => ({
      loadByAlbumIdIfNotLoaded$: events
        .on(albumOverviewPageEvents.idChanged)
        .pipe(
          filter(({ albumId }) => !songsByAlbumMap()[albumId]),
          switchMap(({ albumId }) =>
            songsService.getByAlbumId(albumId).pipe(
              mapResponse({
                next: (songs) =>
                  songsApiEvents.loadedByAlbumIdSuccess({ songs, albumId }),
                error: (error: { message: string }) =>
                  songsApiEvents.loadedByAlbumIdError({ error: error.message }),
              }),
            ),
          ),
        ),
    }),
  ),
  withDisplayErrorEffect(songsApiEvents.loadedByAlbumIdError),
);
