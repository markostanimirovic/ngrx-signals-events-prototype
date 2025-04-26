import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { AlbumSongsComponent } from './album-songs/album-songs.component';
import { AlbumOverviewStore } from './album-overview.store';

@Component({
  selector: 'app-album-overview',
  imports: [
    MatFabButton,
    MatIcon,
    ProgressBarComponent,
    AlbumDetailsComponent,
    AlbumSongsComponent,
  ],
  template: `
    <app-progress-bar [showProgress]="store.showProgress()" />

    <div class="container">
      <h1>Album Overview</h1>

      <div class="album-shell">
        <button mat-fab color="primary" (click)="goToPreviousAlbum()">
          <mat-icon>arrow_left</mat-icon>
        </button>

        <app-album-details
          [album]="store.album()"
          [showSpinner]="store.showAlbumSpinner()"
        />
        <app-album-songs
          [songs]="store.songs()"
          [showSpinner]="store.showSongsSpinner()"
        />

        <button mat-fab color="primary" (click)="goToNextAlbum()">
          <mat-icon>arrow_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  providers: [AlbumOverviewStore],
  styleUrl: './album-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumOverviewComponent {
  readonly #router = inject(Router);
  readonly store = inject(AlbumOverviewStore);

  goToNextAlbum(): void {
    this.#router.navigate(['albums', this.store.albumId() + 1]);
  }

  goToPreviousAlbum(): void {
    this.#router.navigate(['albums', this.store.albumId() - 1]);
  }
}
