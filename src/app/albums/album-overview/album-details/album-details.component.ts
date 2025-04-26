import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Album } from '@/albums/album.model';

@Component({
  selector: 'app-album-details',
  imports: [NgOptimizedImage, DatePipe, MatProgressSpinner],
  template: `
    @if (album(); as album) {
      <h2>{{ album.title }}</h2>
      <h3>by {{ album.artist }}</h3>

      <img
        [ngSrc]="album.coverImage"
        [alt]="album.title + ' Cover Image'"
        priority="high"
        height="250"
        width="250"
      />

      <div class="album-info">
        <p>
          <strong>Release Date: </strong>
          {{ album.releaseDate | date }}
        </p>
        <p><strong>Genre:</strong> {{ album.genre }}</p>
      </div>
    } @else if (showSpinner()) {
      <mat-spinner />
    }
  `,
  styleUrl: './album-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailsComponent {
  readonly album = input<Album | null>(null);
  readonly showSpinner = input(false);
}
