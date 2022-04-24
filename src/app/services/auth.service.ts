import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import IUser from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  isAuth$: Observable<boolean>

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    this.usersCollection = db.collection('users');
    this.isAuth$ = auth.user.pipe(map(user => Boolean(user)))
  }

  async createUser(userData: IUser) {
    const { name, email, password } = userData;
    if (!password) throw new Error('Password not provided!')
    const { user } = await this.auth.createUserWithEmailAndPassword(email, password);
    if (!user) throw new Error("User can't be found")
    await user.updateProfile({ displayName: name })
    await this.usersCollection.doc(user.uid).set({ name, email })
  }

  async logout(e: Event) {
    if (e) e.preventDefault();
    await this.auth.signOut()
    if (!this.router.url.includes('/about')) await this.router.navigateByUrl('/home')
  }
}
