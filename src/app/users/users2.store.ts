import { inject } from '@angular/core';
import { exhaustMap, tap } from 'rxjs';
import { signalStore } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  Dispatcher,
  when,
  withEffects,
  withReducer,
} from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '../shared/request-status.feature';
import { User } from './user.model';
import { usersApiEvents, usersPageEvents } from './users.events';
import { UsersService } from './users.service';

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities<User>(),
  withRequestStatus(),
  withReducer(
    when(usersPageEvents.opened, usersPageEvents.refresh, setPending),
    when(usersApiEvents.usersLoadedSuccess, ({ users }) => [
      setAllEntities(users),
      setFulfilled(),
    ]),
    when(usersApiEvents.usersLoadedError, ({ error }) => setError(error)),
  ),
  withEffects(
    (
      _,
      dispatcher = inject(Dispatcher),
      usersService = inject(UsersService),
    ) => ({
      loadUsers$: dispatcher
        .on(usersPageEvents.opened, usersPageEvents.refresh)
        .pipe(
          exhaustMap(() =>
            usersService.getAll().pipe(
              mapResponse({
                next: (users) => usersApiEvents.usersLoadedSuccess({ users }),
                error: (error: { message: string }) =>
                  usersApiEvents.usersLoadedError({ error: error.message }),
              }),
            ),
          ),
        ),
      logError$: dispatcher
        .on(usersApiEvents.usersLoadedError)
        .pipe(tap(({ error }) => console.log(error))),
    }),
  ),
);
