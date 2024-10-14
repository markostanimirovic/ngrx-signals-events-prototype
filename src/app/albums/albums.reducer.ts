import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState, setEntities, setEntity } from '@ngrx/signals/entities';
import { when, withReducer } from '@ngrx/signals/events';
import {
  RequestStatusState,
  setError,
  setFulfilled,
  setPending,
} from '@/shared/state/request-status.feature';
import { Album } from './album.model';
import { albumsApiEvents } from './albums.events';
import { albumSearchPageEvents } from './album-search/album-search.events';
import { albumOverviewPageEvents } from './album-overview/album-overview.events';

export function withAlbumsReducer() {
  return signalStoreFeature(
    { state: type<EntityState<Album> & RequestStatusState>() },
    withReducer(
      when(albumSearchPageEvents.opened, setPending),
      when(albumOverviewPageEvents.idChanged, ({ albumId }, { entityMap }) =>
        entityMap[albumId] ? {} : setPending(),
      ),
      when(albumsApiEvents.loadedSuccess, ({ albums }, {}) => [
        setEntities(albums),
        setFulfilled(),
      ]),
      when(albumsApiEvents.loadedByIdSuccess, ({ album }) => [
        setEntity(album),
        setFulfilled(),
      ]),
      when(
        albumsApiEvents.loadedError,
        albumsApiEvents.loadedByIdError,
        ({ error }) => setError(error),
      ),
    ),
  );
}
