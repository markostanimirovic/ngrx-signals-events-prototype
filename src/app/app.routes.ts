import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/artists', pathMatch: 'full' },
  {
    path: 'artists',
    loadComponent: () => import('@/artists/artists.component'),
    title: 'Artists',
  },
  { path: 'albums', loadChildren: () => import('@/albums/albums.routes') },
  {
    path: '**',
    loadComponent: () => import('@/core/not-found/not-found.component'),
    title: 'Not Found',
  },
];
