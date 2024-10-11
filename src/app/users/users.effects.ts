import { inject } from '@angular/core';
import { exhaustMap, tap } from 'rxjs';
import { signalStoreFeature } from '@ngrx/signals';
import { Dispatcher, withEffects } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { UsersService } from './users.service';
import { usersApiEvents, usersPageEvents } from './users.events';

export function withUsersEffects() {
  return signalStoreFeature(
    withEffects(
      (
        _,
        dispatcher = inject(Dispatcher),
        usersService = inject(UsersService),
      ) => ({
        loadUsers$: dispatcher
          .on(usersPageEvents.opened, usersPageEvents.refreshed)
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
}
