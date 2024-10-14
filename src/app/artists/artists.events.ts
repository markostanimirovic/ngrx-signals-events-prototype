import { emptyProps, eventGroup, props } from '@ngrx/signals/events';
import { Artist } from './artist.model';

export const artistsPageEvents = eventGroup({
  source: 'Artists Page',
  events: {
    opened: emptyProps(),
    refreshed: emptyProps(),
  },
});

export const artistsApiEvents = eventGroup({
  source: 'Artists API',
  events: {
    loadedSuccess: props<{ artists: Artist[] }>(),
    loadedError: props<{ error: string }>(),
  },
});
