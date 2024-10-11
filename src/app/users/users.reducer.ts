import { signalStoreFeature, type } from '@ngrx/signals';
import { EntityState, setAllEntities } from '@ngrx/signals/entities';
import { when, withReducer } from '@ngrx/signals/events';
import {
  RequestStatusState,
  setError,
  setFulfilled,
  setPending,
} from '../shared/request-status.feature';
import { User } from './user.model';
import { usersApiEvents, usersPageEvents } from './users.events';

export function withUsersReducer() {
  return signalStoreFeature(
    { state: type<EntityState<User> & RequestStatusState>() },
    withReducer(
      when(usersPageEvents.opened, usersPageEvents.refreshed, setPending),
      when(usersApiEvents.usersLoadedSuccess, ({ users }) => [
        setAllEntities(users),
        setFulfilled(),
      ]),
      when(usersApiEvents.usersLoadedError, ({ error }) => setError(error)),
    ),
  );
}
