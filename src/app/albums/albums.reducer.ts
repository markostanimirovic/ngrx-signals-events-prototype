import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState, setEntities, setEntity } from '@ngrx/signals/entities';
import { on, withReducer } from '@ngrx/signals/events';
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
      on(albumSearchPageEvents.opened, setPending),
      on(albumOverviewPageEvents.idChanged, ({ albumId }, { entityMap }) =>
        entityMap[albumId] ? {} : setPending(),
      ),
      on(albumsApiEvents.loadedSuccess, ({ albums }, {}) => [
        setEntities(albums),
        setFulfilled(),
      ]),
      on(albumsApiEvents.loadedByIdSuccess, ({ album }) => [
        setEntity(album),
        setFulfilled(),
      ]),
      on(
        albumsApiEvents.loadedError,
        albumsApiEvents.loadedByIdError,
        ({ error }) => setError(error),
      ),
    ),
  );
}
