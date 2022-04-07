import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private modal: ModalService) { }
  ngOnInit(): void { }

  showModal(e: Event) {
    e.preventDefault();
    this.modal.toggleModal('auth')
  }

}
