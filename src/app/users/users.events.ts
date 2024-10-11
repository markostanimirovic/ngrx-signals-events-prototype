import { emptyProps, eventGroup, props } from '@ngrx/signals/events';
import { User } from './user.model';

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
    usersLoadedError: props<{ error: string }>(),
  },
});
