import { eventGroup, props } from '@ngrx/signals/events';

export const albumOverviewPageEvents = eventGroup({
  source: 'Album Overview Page',
  events: {
    idChanged: props<{ albumId: number }>(),
  },
});
