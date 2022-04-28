import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  videoOrder: string;
  sort$: BehaviorSubject<string>
  clips: IClip[] = []
  activeClip: IClip | null = null;
  copiedIdx!: number;

  constructor(public router: Router, public route: ActivatedRoute, private clipService: ClipService, private modal: ModalService) {
    this.videoOrder = clipService.videoOrder;
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(({ sort }) => {
      this.videoOrder = this.clipService.videoOrder = sort === '2' ? sort : sort === '1' ? '1' : this.videoOrder;
      this.sort$.next(this.videoOrder)
    })
    this.clipService.getUserClips(this.sort$).subscribe(docs => this.clips = docs)
  }

  sort(e: Event) {
    const { value } = (e.target as HTMLSelectElement)
    this.router.navigateByUrl(`/manage?sort=${value}`)
  }

  openModal(e: Event, clip: IClip) {
    e.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip')
  }

  update($event: IClip) {
    this.clips.forEach((clip, idx) => {
      if (clip.docID === $event.docID) this.clips[idx].title = $event.title;
    })
  }

  deleteClip(e: Event, clip: IClip) {
    e.preventDefault();
    this.clipService.deleteClip(clip)
    this.clips = this.clips.filter(({ docID }) => docID !== clip.docID)
  }

  copyLink(clipUrl: string, idx: number) {
    this.copiedIdx = idx;
    navigator.clipboard.writeText(clipUrl)
  }

  navigateToClip(clip: IClip) {
    this.router.navigate(['/clip', clip.fileName])
  }

}
