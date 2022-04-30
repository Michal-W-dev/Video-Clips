import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {
  @Input() show = false;
  @Input() size: 2 | 3 | 4 = 2;
  @Input() color: 'red' | 'indigo' | 'green' = 'indigo';

  constructor() { }

  ngOnInit(): void {
  }

}
