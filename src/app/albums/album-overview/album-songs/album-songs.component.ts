import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { Song } from '@/songs/song.model';

@Component({
  selector: 'app-album-songs',
  imports: [MatProgressSpinner, MatCard],
  template: `
    @if (showSpinner()) {
      <mat-spinner />
    } @else {
      @for (song of songs(); track song.id) {
        <mat-card class="song">
          <p class="song-title">{{ song.title }}</p>
          <p>{{ song.duration }}</p>
        </mat-card>
      }
    }
  `,
  styleUrl: './album-songs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumSongsComponent {
  readonly songs = input<Song[]>([]);
  readonly showSpinner = input(false);
}
