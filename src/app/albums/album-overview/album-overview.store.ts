import { computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { signalStore, withComputed, withHooks } from '@ngrx/signals';
import { Events, injectDispatch, withEffects } from '@ngrx/signals/events';
import { withRouteParams } from '@/shared/state/route-params.feature';
import { SongsStore } from '@/songs/songs.store';
import { AlbumsStore } from '@/albums/albums.store';
import { albumsApiEvents } from '@/albums/albums.events';
import { albumOverviewPageEvents } from './album-overview.events';

export const AlbumOverviewStore = signalStore(
  withRouteParams({ albumId: Number }),
  withComputed(
    (
      { albumId },
      albumsStore = inject(AlbumsStore),
      songsStore = inject(SongsStore),
    ) => ({
      album: computed(() =>
        albumId() ? albumsStore.entityMap()[albumId()] : null,
      ),
      songs: computed(() =>
        (songsStore.songsByAlbumMap()[albumId()] || []).map(
          (id) => songsStore.entityMap()[id],
        ),
      ),
      showAlbumSpinner: albumsStore.isPending,
      showSongsSpinner: songsStore.isPending,
      showProgress: computed(
        () => albumsStore.isPending() || songsStore.isPending(),
      ),
    }),
  ),
  withEffects((_, events = inject(Events), router = inject(Router)) => ({
    redirectToNotFound$: events
      .on(albumsApiEvents.loadedByIdError)
      .pipe(tap(() => router.navigateByUrl('/not-found'))),
  })),
  withHooks({
    onInit({ albumId }, dispatch = injectDispatch(albumOverviewPageEvents)) {
      effect(() => dispatch.idChanged({ albumId: albumId() }));
    },
  }),
);
