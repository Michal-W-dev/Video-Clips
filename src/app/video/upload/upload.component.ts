import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { v4 as uuid } from 'uuid'

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
  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void { }

  storeFile(e: Event) {
    this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file || this.file.type !== 'video/mp4') return
    const name = this.file.name.split('.').slice(0, -1).join('.')
    this.title.setValue(name)
    this.isFileLoaded = true
  }

  uploadFile() {
    const clipFileName = this.title.value.split(' ').join('-').substring(0, 12) + uuid().substring(0, 5)
    const clipPath = `clips/${clipFileName}.mp4`
    this.storage.upload(clipPath, this.file).catch(e => console.log(e))
  }
}
