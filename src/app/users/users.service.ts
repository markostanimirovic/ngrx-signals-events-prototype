import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  getAll(): Observable<User[]> {
    return of([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]).pipe(delay(2_000));
  }
}
