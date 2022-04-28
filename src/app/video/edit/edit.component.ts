import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { AlertService } from 'src/app/services/alert.service';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter<IClip>()

  clipID = new FormControl('')
  title = new FormControl('', [Validators.required, Validators.minLength(3)])
  editForm = new FormGroup({ id: this.clipID, title: this.title })

  constructor(public modal: ModalService, private alert: AlertService, private clipService: ClipService) {
  }

  ngOnInit(): void {
    this.modal.registerModal('editClip')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) return
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  async submit() {
    if (!this.activeClip) return
    this.alert.show('indigo', 'Please wait! Updating clip.')
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)
    } catch (e) {
      this.alert.show('red', 'Something went wrong. Try again later');
      return
    }
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)
    this.alert.show('green', 'Success!');
  }

}
