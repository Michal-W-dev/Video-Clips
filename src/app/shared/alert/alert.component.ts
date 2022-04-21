import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() color: 'green' | 'red' | 'indigo' = 'indigo'

  constructor() { }
  ngOnInit(): void {
  }

  get bgColor() { return `bg-${this.color}-500` }

}
