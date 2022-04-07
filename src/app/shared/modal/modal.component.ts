import { Component, Input, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id = ''
  constructor(public modal: ModalService, public el: ElementRef) { }

  ngOnInit(): void {
    this.modal.registerModal(this.id)
    document.body.appendChild(this.el.nativeElement)
  }

  closeModal() { this.modal.toggleModal(this.id) }

  ngOnDestroy(): void {
    this.modal.unregister(this.id)
  }
}
