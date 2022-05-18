import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';
import firebase from 'firebase/compat/app'

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss'],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = false;

  constructor(public clipService: ClipService, private zone: NgZone) {
    this.clipService.getClips()
  }

  ngOnInit(): void {
    if (this.scrollable) {
      this.zone.runOutsideAngular(() => window.addEventListener('scroll', this.handleScroll))
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) window.removeEventListener('scroll', this.handleScroll)
    this.clipService.pageClips = []
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
    if (bottomOfWindow) this.clipService.getClips()
  }

  getDate(clip: IClip) {
    return (clip.timestamp as firebase.firestore.Timestamp)?.toDate()
  }

}
