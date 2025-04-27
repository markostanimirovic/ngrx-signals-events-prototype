import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { SortOrder } from '@/shared/models/sort-order.model';
import { AlbumsStore } from '@/albums/albums.store';
import { searchAlbums, sortAlbums } from '@/albums/album.model';
import { albumSearchPageEvents } from './album-search.events';

export const AlbumSearchStore = signalStore(
  withState({ query: '', order: 'asc' as SortOrder }),
  withComputed(({ query, order }, albumsStore = inject(AlbumsStore)) => {
    const albums = computed(() => {
      const searchedAlbums = searchAlbums(albumsStore.entities(), query());
      return sortAlbums(searchedAlbums, order());
    });
    const albumsCount = computed(() => albums().length);
    const showProgress = albumsStore.isPending;
    const showSpinner = computed(() => showProgress() && albumsCount() === 0);

    return { albums, albumsCount, showProgress, showSpinner };
  }),
  withReducer(
    on(albumSearchPageEvents.queryChanged, ({ query }) => ({ query })),
    on(albumSearchPageEvents.orderChanged, ({ order }) => ({ order })),
  ),
);
