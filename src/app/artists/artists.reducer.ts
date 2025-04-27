import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState, setAllEntities } from '@ngrx/signals/entities';
import { on, withReducer } from '@ngrx/signals/events';
import {
  RequestStatusState,
  setError,
  setFulfilled,
  setPending,
} from '@/shared/state/request-status.feature';
import { Artist } from './artist.model';
import { artistsApiEvents, artistsPageEvents } from './artists.events';

export function withArtistsReducer() {
  return signalStoreFeature(
    { state: type<EntityState<Artist> & RequestStatusState>() },
    withReducer(
      on(artistsPageEvents.opened, artistsPageEvents.refreshed, setPending),
      on(artistsApiEvents.loadedSuccess, ({ artists }) => [
        setAllEntities(artists),
        setFulfilled(),
      ]),
      on(artistsApiEvents.loadedError, ({ error }) => setError(error)),
    ),
  );
}
