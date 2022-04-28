import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { v4 as uuid } from 'uuid'
import { AlertService } from 'src/app/services/alert.service';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { InputComponent } from 'src/app/shared/input/input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  @ViewChild(InputComponent, { read: ElementRef }) inputComp!: ElementRef<HTMLElement>;
  idx = 0;
  file: File | null = null
  isFileLoaded = false
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  title = new FormControl('', [Validators.required, Validators.minLength(3)])
  uploadForm = new FormGroup({ title: this.title })

  constructor(
    private storage: AngularFireStorage,
    private alert: AlertService,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe(user => this.user = user)
  }

  ngOnDestroy(): void { this.task?.cancel() }

  storeFile(e: Event) {
    // Retrieve data from (dragged or inserted) file
    const dragData = (e as DragEvent).dataTransfer
    this.file = dragData ? dragData?.files.item(0) ?? null
      : (e.target as HTMLInputElement).files?.item(0) ?? null

    // Check data type
    if (!this.file || this.file.type !== 'video/mp4') return

    const name = this.file.name.split('.').slice(0, -1).join('.')
    this.title.setValue(name)
    this.isFileLoaded = true;

    // Set focus on title input
    const inputEl = this.inputComp.nativeElement.firstChild as HTMLInputElement
    inputEl.focus()
  }

  uploadFile() {
    this.uploadForm.disable();
    this.alert.show('indigo', 'Please wait! Your clip is being uploaded.');
    this.showPercentage = true
    const clipFileName = this.title.value.split(' ').join('-').substring(0, 12) + '-' + uuid().substring(0, 5)
    const clipPath = `clips/${clipFileName}.mp4`
    this.task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    this.task.percentageChanges().subscribe(percent => this.percentage = percent as number / 100)
    this.task.snapshotChanges().pipe(last(), switchMap(() => clipRef.getDownloadURL())).subscribe({
      next: async (url) => {
        this.alert.show('green', 'Your clip is now ready!');
        const { uid, displayName } = this.user as { uid: string, displayName: string };
        const clip = {
          uid, displayName, url,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipService.createClip(clip)
        setTimeout(() => this.router.navigate(['/clip', clip.fileName]), 1400)
      },
      error: (e) => this.alert.show('red', 'Upload failed! Please try again later.')
    }).add(() => { this.showPercentage = false; this.uploadForm.enable() })
  }
}
