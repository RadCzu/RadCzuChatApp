import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { MainViewComponent } from './main-view/main-view.component';

export const routes: Routes = [

  { path: 'account/:id', component: MainViewComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), 
  ],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }