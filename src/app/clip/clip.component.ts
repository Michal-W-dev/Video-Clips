import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IClip from '../models/clip.model';
import firebase from 'firebase/compat/app';
import videojs from 'video.js'

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef<HTMLVideoElement>;
  player?: videojs.Player;
  clip: IClip | null = null;

  constructor(public route: ActivatedRoute, private zone: NgZone) { }

  ngOnInit(): void {
    if (this.target) {
      this.zone.runOutsideAngular(() => this.player = videojs(this.target!.nativeElement))
    }

    this.route.data.subscribe(data => {
      this.clip = data['clip'] as IClip
      this.player?.src({ src: this.clip.url })
    })
    // this.route.params.subscribe(params => {
    //   this.fileName = params['id'].slice(0, -4)
    //   this.clipService.getClip(this.fileName).then(snapshot => this.clip = snapshot.docs[0].data())
    // })
  }

  get getDate() {
    return (this.clip?.timestamp as firebase.firestore.Timestamp)?.toDate()
  }

}
