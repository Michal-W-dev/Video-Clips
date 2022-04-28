import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null;
  constructor(private router: Router, private route: ActivatedRoute, private clipService: ClipService, private modal: ModalService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
    })
    this.clipService.getUserClips().subscribe(docs => this.clips = docs)
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

}
