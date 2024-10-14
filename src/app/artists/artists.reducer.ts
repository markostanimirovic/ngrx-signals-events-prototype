import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState, setAllEntities } from '@ngrx/signals/entities';
import { when, withReducer } from '@ngrx/signals/events';
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
      when(artistsPageEvents.opened, artistsPageEvents.refreshed, setPending),
      when(artistsApiEvents.loadedSuccess, ({ artists }) => [
        setAllEntities(artists),
        setFulfilled(),
      ]),
      when(artistsApiEvents.loadedError, ({ error }) => setError(error)),
    ),
  );
}
