import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { injectDispatch } from '@ngrx/signals/events';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { ArtistsStore } from './artists.store';
import { artistsPageEvents } from './artists.events';

@Component({
  selector: 'app-artists',
  imports: [
    DatePipe,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
    MatCard,
    MatCardSubtitle,
    MatCardTitle,
    ProgressBarComponent,
  ],
  template: `
    <app-progress-bar [showProgress]="store.isPending()" />

    <div class="container">
      <div class="header">
        <h1>Artists ({{ store.total() }})</h1>
        <button mat-icon-button (click)="dispatch.refreshed()">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      @if (store.isPending() && store.total() === 0) {
        <mat-spinner />
      } @else {
        <div class="artists-container">
          @for (artist of store.entities(); track artist.id) {
            <mat-card>
              <img
                [src]="artist.photo"
                [alt]="artist.name + ' Photo'"
                height="100"
                width="100"
              />
              <h2>{{ artist.name }}</h2>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './artists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistsComponent implements OnInit {
  readonly store = inject(ArtistsStore);
  readonly dispatch = injectDispatch(artistsPageEvents);

  ngOnInit() {
    this.dispatch.opened();
  }
}
