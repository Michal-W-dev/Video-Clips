import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { delay, interval, map, take, takeLast, timer } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('f') loginForm!: NgForm;
  pendingSubmission = false;
  user = { email: '', password: '' }


  constructor(private auth: AngularFireAuth, public alert: AlertService) { }

  ngOnInit(): void { }

  async login() {
    this.alert.show('indigo', "Please wait! We're logging you in.")
    const { email, password } = this.loginForm.value
    try {
      await this.auth.signInWithEmailAndPassword(email, password)
    } catch (e) {
      this.alert.show('red', 'An unexpected error occurred. Please try again later.')
      this.pendingSubmission = false;
      return;
    }
    this.alert.show('green', 'You are now logged in!')
  }

  loginGuest() {
    this.user = { email: '', password: '' }
    const email = 'guest@guest.pl'
    const password = '321321'
    interval(30).pipe(map(i => this.user.email += email[i]), take(email.length)).subscribe()
    timer(600, 35).pipe(map(i => this.user.password += password[i]), take(password.length), delay(1))
      .subscribe({ complete: () => this.login() })
  }
}
