# `@ngrx/signals/events`

Prototype of SignalStore plugin for event-based state management.

> [!WARNING]
> This project is a playground for experimenting with event-driven architecture using NgRx SignalStore.
> It is not intended for production use.

## Walkthrough

### Defining Events

Event creators are defined using the `eventGroup` function:

```ts
// users.events.ts

import { emptyProps, eventGroup, props } from '@ngrx/signals/events';

export const usersPageEvents = eventGroup({
  source: 'Users Page',
  events: {
    opened: emptyProps(),
    refreshed: emptyProps(),
  },
});

export const usersApiEvents = eventGroup({
  source: 'Users API',
  events: {
    usersLoadedSuccess: props<{ users: User[] }>(),
    usersLoadedFailure: props<{ error: string }>(),
  },
});
```

### Performing State Changes

The reducer is added to the SignalStore using the `withReducer` feature. Case reducers are defined using the `when` function:

```ts
// users.store.ts

import { when, withReducer } from '@ngrx/signals/events';

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities<User>(),
  withRequestStatus(),
  withReducer(
    when(usersPageEvents.opened, usersPageEvents.refreshed, setPending),
    when(usersApiEvents.usersLoadedSuccess, ({ users }) => [
      setAllEntities(users),
      setFulfilled(),
    ]),
    when(usersApiEvents.usersLoadedError, ({ error }) => setError(error)),
  ),
);
```

### Performing Side Effects

Side effects are added to the SignalStore using the `withEffects` feature:

```ts
// users.store.ts

import { Dispatcher, withEffects } from '@ngrx/signals/events';

export const UsersStore = signalStore(
  /* ... */
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
```

Dispatched events can be listened to using the `Dispatcher` service.
If an effect returns a new event, it will be dispatched automatically.

### Reading State

State and computed signals are accessed via SignalStore:

```ts
// users.component.ts

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <h1>Users</h1>

    @if (usersStore.isPending()) {
      <p>Loading...</p>
    }

    <ul>
      @for (user of usersStore.entities(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly usersStore = inject(UsersStore);
}
```

### Dispatching Events

Events are dispatched using the `Dispatcher` service:

```ts
// users.component.ts

import { Dispatcher } from '@ngrx/signals/events';

@Component({
  /* ... */
  template: `
    <h1>Users</h1>

    <button (click)="onRefresh()">Refresh</button>

    <!-- ... -->
  `,
})
export class UsersComponent implements OnInit {
  readonly usersStore = inject(UsersStore);
  readonly dispatcher = inject(Dispatcher);

  ngOnInit() {
    this.dispatcher.dispatch(usersPageEvents.opened());
  }

  onRefresh(): void {
    this.dispatcher.dispatch(usersPageEvents.refreshed());
  }
}
```

It's also possible to define self-dispatching events using the `injectDispatch` function:

```ts
// users.component.ts

import { injectDispatch } from '@ngrx/signals/events';

@Component({
  /* ... */
  template: `
    <h1>Users</h1>

    <button (click)="dispatch.refreshed()">Refresh</button>

    <!-- ... -->
  `,
})
export class UsersComponent implements OnInit {
  readonly usersStore = inject(UsersStore);
  readonly dispatch = injectDispatch(usersPageEvents);

  ngOnInit() {
    this.dispatch.opened();
  }
}
```

### Scaling Up

The reducer can be moved to a separate file using the custom SignalStore feature:

```ts
// users.reducer.ts

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
```

The same can be done for effects:

```ts
// users.effects.ts

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
```

The final SignalStore implementation will look like this:

```ts
// users.store.ts

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities<User>(),
  withRequestStatus(),
  withUsersReducer(),
  withUsersEffects(),
);
``` 
