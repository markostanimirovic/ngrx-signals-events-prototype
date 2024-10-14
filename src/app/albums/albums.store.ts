import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withRequestStatus } from '@/shared/state/request-status.feature';
import { withAlbumsReducer } from './albums.reducer';
import { withAlbumsEffects } from './albums.effects';
import { Album } from './album.model';

export const AlbumsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Album>(),
  withRequestStatus(),
  withAlbumsReducer(),
  withAlbumsEffects(),
);
