import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private modal: ModalService, public auth: AuthService, private afAuth: AngularFireAuth) {
  }
  ngOnInit(): void { }

  showModal(e: Event) {
    e.preventDefault();
    this.modal.toggleModal('auth')
  }

  async logout(e: Event) {
    e.preventDefault();
    await this.afAuth.signOut()
  }

}
