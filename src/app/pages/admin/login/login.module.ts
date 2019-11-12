import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ToastModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
    ReactiveFormsModule,
  ]
})
export class LoginModule { }
