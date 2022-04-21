import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') loginForm!: NgForm;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.loginForm.value)
  }
}
