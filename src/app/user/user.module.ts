import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AuthModalComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    CommonModule, SharedModule, ReactiveFormsModule
  ],
  exports: [AuthModalComponent]
})
export class UserModule { }
