import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore'
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, combineLatest, map, of, switchMap, lastValueFrom } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;
  videoOrder: '1' | '2' = '1'
  pageClips: IClip[] = []
  pendingRequest = false;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
    this.clipsCollection = db.collection('clips')
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  getUserClips($sort: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, $sort]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        if (!user) return of([])
        const query = this.clipsCollection.ref.where('uid', '==', user.uid).orderBy('timestamp', sort === '1' ? 'desc' : 'asc')
        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs),
      map(docs => docs?.map(doc => ({ docID: doc.id, ...doc.data() })))
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({ title })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}.mp4`)
    const screenshotRef = this.storage.ref(`images/${clip.fileName}.jpg`)
    // Delete from storage
    await clipRef.delete()
    await screenshotRef.delete()
    // Delete from firestore
    await this.clipsCollection.doc(clip.docID).delete()
  }

  getClip(fileName: string) {
    return this.clipsCollection.ref.where('fileName', '==', fileName).get()
  }

  async getClips() {
    if (this.pendingRequest) return

    this.pendingRequest = true;
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(3)
    const { length } = this.pageClips;

    if (length) {
      // clip.docID
      const lastDocID = this.pageClips[length - 1].docID

      const lastDoc$ = this.clipsCollection.doc(lastDocID).get()
      const lastDoc = await lastValueFrom(lastDoc$)

      // Look for docs after lastDoc
      query = query.startAfter(lastDoc)
    }
    const snapshot = await query.get()
    snapshot.forEach(doc => this.pageClips.push({ docID: doc.id, ...doc.data() }))

    this.pendingRequest = false;
  }

}
