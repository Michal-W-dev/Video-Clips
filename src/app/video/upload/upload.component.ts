import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  idx = 0;
  file: File | null = null
  isFileLoaded = false

  title = new FormControl('', [Validators.required, Validators.minLength(3)])
  uploadForm = new FormGroup({ title: this.title })
  constructor() { }

  ngOnInit(): void { }

  storeFile(e: Event) {
    this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file || this.file.type !== 'video/mp4') return
    // if (!this.file) return
    const fileName = this.file.name.split('.').slice(0, -1).join('.')
    this.title.setValue(fileName)
    this.isFileLoaded = true

  }

  uploadFile() {
    console.log('File was uploaded.')
  }
}
