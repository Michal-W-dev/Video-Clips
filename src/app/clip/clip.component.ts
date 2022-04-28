import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss']
})
export class ClipComponent implements OnInit {
  fileName = '';
  clip: IClip | null = null;

  constructor(public route: ActivatedRoute, private clipService: ClipService) { }

  ngOnInit(): void {
    this.fileName = this.route.snapshot.params?.['id']

    this.route.params.subscribe(params => this.fileName = params['id'])
    this.clipService.getClip(this.fileName).then(snapshot => this.clip = snapshot.docs[0]?.data())
  }
}
