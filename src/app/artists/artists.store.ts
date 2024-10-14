import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withRequestStatus } from '@/shared/state/request-status.feature';
import { Artist } from './artist.model';
import { withArtistsReducer } from './artists.reducer';
import { withArtistsEffects } from './artists.effects';

export const ArtistsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Artist>(),
  withRequestStatus(),
  withComputed(({ ids }) => ({
    total: computed(() => ids().length),
  })),
  withArtistsReducer(),
  withArtistsEffects(),
);
