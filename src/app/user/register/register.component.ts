import { Component, OnInit } from '@angular/core';

import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AlertService]
})
export class RegisterComponent implements OnInit {
  pendingSubmission = false;
  registerForm: FormGroup = new FormGroup({});


  constructor(private authService: AuthService, private alert: AlertService) {
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, this.checkPassword]),
    })
  }

  checkPassword = (control: AbstractControl): ValidationErrors | null => {
    const password = this.registerForm.get('password')?.value
    return password !== control.value ? { 'notSame': true } : null
  }

  async register() {
    this.alert.show('indigo', 'Please wait! Your account is being created.')
    this.pendingSubmission = true;
    try {
      await this.authService.createUser(this.registerForm.value)
    } catch (e) {
      this.alert.show('red', 'An unexpected error occurred. Please try again later.')
      this.pendingSubmission = false;
      return;
    }
    this.alert.show('green', 'Your account has been created')
  }

  getControl(inputName: string) { return this.registerForm.get(inputName) as FormControl }
}
