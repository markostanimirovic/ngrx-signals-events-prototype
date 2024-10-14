import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from './artist.model';

const API_URL = 'http://localhost:3000/artists';

@Injectable({ providedIn: 'root' })
export class ArtistsService {
  readonly #http = inject(HttpClient);

  getAll(): Observable<Artist[]> {
    return this.#http.get<Artist[]>(API_URL);
  }
}
