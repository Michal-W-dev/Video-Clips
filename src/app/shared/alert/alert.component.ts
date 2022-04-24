import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  bgColor = ''
  msg = '';
  showAlert = false;
  alertSubscription: Subscription;

  constructor(private alertService: AlertService) {
    this.alertSubscription = this.alertService.emitAlert.subscribe(({ color, msg, showAlert }) => {
      this.msg = msg;
      this.bgColor = `bg-${color}-500`;
      this.showAlert = showAlert;
    })
  }
  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.showAlert = false;
    this.alertSubscription.unsubscribe()
  }

}
