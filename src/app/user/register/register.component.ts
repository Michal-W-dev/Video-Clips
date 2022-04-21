import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  showAlert = false;
  alertMsg = ''
  alertColor: 'indigo' = 'indigo';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm)]),
    confirm_password: new FormControl('', Validators.required),
  })

  constructor() { }

  ngOnInit(): void { }

  register() {
    console.log(this.registerForm)
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'indigo'
  }

  getControl(inputName: string) { return this.registerForm.get(inputName) as FormControl }
}
