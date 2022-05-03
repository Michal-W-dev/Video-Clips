import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AlertService]
})
export class RegisterComponent {
  pendingSubmission = false;
  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, [RegisterValidators.matchPasswords]);


  constructor(private authService: AuthService, private alert: AlertService, private emailTaken: EmailTaken) {
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
