import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

// Import Containers

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'product',
        loadChildren: () => import('../admin/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../admin/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }