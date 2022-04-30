import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss']
})
export class ClipComponent implements OnInit {
  fileName = '';
  clip: IClip | null = null;

  constructor(public route: ActivatedRoute, private clipService: ClipService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.fileName = params['id'].slice(0, -4))
    this.clipService.getClip(this.fileName).then(snapshot => {
      this.clip = snapshot.docs[0]?.data();
    })
  }

  get getDate() {
    return (this.clip?.timestamp as firebase.firestore.Timestamp)?.toDate()
  }

}
