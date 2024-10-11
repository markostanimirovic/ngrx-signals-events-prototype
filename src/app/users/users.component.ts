import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { UsersStore } from './users.store';
import { usersPageEvents } from './users.events';

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <h1>Users</h1>

    <button (click)="onRefresh()">Refresh</button>

    @if (usersStore.isPending()) {
      <span>&nbsp; Loading...</span>
    }

    <ul>
      @for (user of usersStore.entities(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  readonly #dispatcher = inject(Dispatcher);
  readonly usersStore = inject(UsersStore);

  ngOnInit() {
    this.#dispatcher.dispatch(usersPageEvents.opened());
  }

  onRefresh(): void {
    this.#dispatcher.dispatch(usersPageEvents.refresh());
  }
}
