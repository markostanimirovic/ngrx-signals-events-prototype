import { eventGroup, props } from '@ngrx/signals/events';
import { Song } from './song.model';

export const songsApiEvents = eventGroup({
  source: 'Songs API',
  events: {
    loadedByAlbumIdSuccess: props<{ songs: Song[]; albumId: number }>(),
    loadedByAlbumIdError: props<{ error: string }>(),
  },
});
