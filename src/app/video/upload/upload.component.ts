import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  idx = 0;

  constructor() { }

  ngOnInit(): void {
  }

  // selectThumbnail(idx: number) {
  //   idx
  // }
}
