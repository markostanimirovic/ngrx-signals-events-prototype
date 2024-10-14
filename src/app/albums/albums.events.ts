import { eventGroup, props } from '@ngrx/signals/events';
import { Album } from './album.model';

export const albumsApiEvents = eventGroup({
  source: 'Albums API',
  events: {
    loadedSuccess: props<{ albums: Album[] }>(),
    loadedError: props<{ error: string }>(),
    loadedByIdSuccess: props<{ album: Album }>(),
    loadedByIdError: props<{ error: string }>(),
  },
});
