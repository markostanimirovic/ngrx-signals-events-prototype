import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatToolbar, MatAnchor],
  template: `
    <mat-toolbar color="primary">
      <a class="root-link" routerLink="/">
        Event-Driven Architecture with SignalStore
      </a>

      <span class="spacer"></span>

      <a mat-button routerLink="/artists">Artists</a>
      <a mat-button routerLink="/albums">Albums</a>
    </mat-toolbar>
  `,
  styles: `
    .root-link {
      color: inherit;
      text-decoration: none;
    }

    .spacer {
      flex: 1 1 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
