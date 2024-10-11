import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withRequestStatus } from '../shared/request-status.feature';
import { User } from './user.model';
import { withUsersReducer } from './users.reducer';
import { withUsersEffects } from './users.effects';

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities<User>(),
  withRequestStatus(),
  withUsersReducer(),
  withUsersEffects(),
);
