import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatAnchor],
  template: `
    <h1>Oops!</h1>
    <h2>Something went wrong.</h2>
    <a mat-button color="primary" routerLink="/"> Take me home. </a>
  `,
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent {}
