import { emptyProps, eventGroup, props } from '@ngrx/signals/events';
import { SortOrder } from '@/shared/models/sort-order.model';

export const albumSearchPageEvents = eventGroup({
  source: 'Album Search Page',
  events: {
    opened: emptyProps(),
    queryChanged: props<{ query: string }>(),
    orderChanged: props<{ order: SortOrder }>(),
  },
});
