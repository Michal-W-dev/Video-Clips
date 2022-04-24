import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss']
})
export class ClipComponent implements OnInit {
  id = ''
  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params?.['id']
    this.route.params.subscribe(params => this.id = params['id'])
  }

}
