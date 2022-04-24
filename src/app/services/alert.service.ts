import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  emitAlert = new Subject<{ color: string, msg: string, showAlert: boolean }>()

  constructor() { }
  show(color: 'green' | 'red' | 'indigo', msg: string) {
    this.emitAlert.next({ color, msg, showAlert: true })
  }
}
