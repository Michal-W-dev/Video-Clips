import { Pipe, PipeTransform } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Pipe({ name: 'delayObs' })
export class DelayPipe implements PipeTransform {

  transform(obs: Observable<any>, time = 1700) {
    return obs.pipe(delay(time))
  }
}
