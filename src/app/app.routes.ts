import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transaction-list/transaction-list.component').then(
        (m) => m.TransactionListComponent
      ),
  },
  {
    path: 'transactions/new',
    loadComponent: () =>
      import('./features/transactions/transaction-form/transaction-form.component').then(
        (m) => m.TransactionFormComponent
      ),
  },
  {
    path: 'transactions/:id/edit',
    loadComponent: () =>
      import('./features/transactions/transaction-form/transaction-form.component').then(
        (m) => m.TransactionFormComponent
      ),
  },
  {
    path: 'objectives',
    loadComponent: () =>
      import('./features/objectives/objective-list/objective-list.component').then(
        (m) => m.ObjectiveListComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/category-list/category-list.component').then(
        (m) => m.CategoryListComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
