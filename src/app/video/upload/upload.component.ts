import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { v4 as uuid } from 'uuid'
import { AlertService } from 'src/app/services/alert.service';
import { combineLatest, last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { InputComponent } from 'src/app/shared/input/input.component';
import { Router } from '@angular/router';
import Utils from 'src/app/shared/utils/util';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  @ViewChild(InputComponent, { read: ElementRef }) inputComp!: ElementRef<HTMLElement>;
  isFileLoaded = false
  isImgLoading = false;
  showPercentage = false;
  percentage = 0;
  imgIdx = 0;
  file: File | null = null
  user: firebase.User | null = null;
  taskClip?: AngularFireUploadTask;
  taskImage?: AngularFireUploadTask;
  imgSources = ['', '', '']


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

  ngOnDestroy(): void { this.taskClip?.cancel() }

  storeFile(e: Event) {
    this.isImgLoading = true;
    // Retrieve data from (dragged or inserted) file
    const dragData = (e as DragEvent).dataTransfer

    this.file = dragData ? dragData?.files.item(0) ?? null
      : (e.target as HTMLInputElement).files?.item(0) ?? null

    // Check data type
    if (!this.file || this.file.type !== 'video/mp4') return

    Utils.snapshooter(this.file).then(result => {
      this.imgSources = result.snapshootsArray;
      this.isImgLoading = result.isLoading;
    }).catch(e => this.alert.show('red', e.message || 'Something went wrong'))


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
    const fileName = this.title.value.split(' ').join('-').substring(0, 12) + '-' + uuid().substring(0, 5)

    const clipPath = `clips/${fileName}.mp4`
    const clipRef = this.storage.ref(clipPath)
    this.taskClip = this.storage.upload(clipPath, this.file)
    this.taskClip.percentageChanges().subscribe(percent => this.percentage = percent as number / 100)

    const imgPath = `images/${fileName}.jpg`
    const imgRef = this.storage.ref(imgPath)
    // putString -> like upload but you can send decode type (base64).
    this.taskImage = imgRef.putString(this.imgSources[this.imgIdx].split(',')[1], "base64", { contentType: 'image/jpg' })

    // When storage uploads finish, ask for downloadURLs & send them to clip firebase.
    combineLatest([this.taskImage.snapshotChanges(), this.taskClip.snapshotChanges()]).pipe(
      last(), switchMap(() => combineLatest([imgRef.getDownloadURL(), clipRef.getDownloadURL()]))
    ).subscribe({
      next: async (urlValues) => {
        const [imgUrl, url] = urlValues;
        this.alert.show('green', 'Your clip is now ready!');
        const { uid, displayName } = this.user as { uid: string, displayName: string };
        const clip = {
          url, imgUrl, uid, displayName, fileName,
          title: this.title.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipService.createClip(clip)
        setTimeout(() => this.router.navigate(['/clip', `${clip.fileName}.mp4`]), 1200)
      },
      error: (e) => this.alert.show('red', 'Upload failed! Please try again later.')
    }).add(() => { this.showPercentage = false; this.uploadForm.enable() })
  }
}
