import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { AlbumFilterComponent } from './album-filter/album-filter.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumSearchStore } from './album-search.store';
import { albumSearchPageEvents } from './album-search.events';

@Component({
  selector: 'app-album-search',
  standalone: true,
  imports: [ProgressBarComponent, AlbumFilterComponent, AlbumListComponent],
  template: `
    <app-progress-bar [showProgress]="store.showProgress()" />

    <div class="container">
      <h1>Albums ({{ store.albumsCount() }})</h1>

      <app-album-filter
        [query]="store.query()"
        [order]="store.order()"
        (queryChange)="dispatch.queryChanged({ query: $event })"
        (orderChange)="dispatch.orderChanged({ order: $event })"
      />

      <app-album-list
        [albums]="store.albums()"
        [showSpinner]="store.showSpinner()"
      />
    </div>
  `,
  providers: [AlbumSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumSearchComponent implements OnInit {
  readonly store = inject(AlbumSearchStore);
  readonly dispatch = injectDispatch(albumSearchPageEvents);

  ngOnInit() {
    this.dispatch.opened();
  }
}
