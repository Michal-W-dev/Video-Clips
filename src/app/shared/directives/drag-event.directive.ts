import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appDragEvent]' })
export class DragEventDirective {
  @Input() dragOverClass = 'bg-indigo-600/20 border-indigo-200 border-double';

  @HostBinding('class') dragClass = 'string';

  //Block default opening file in new tab, change style on drag over
  @HostListener('dragover', ['$event']) handleDragOver(e: Event) { e.preventDefault(); this.dragClass = this.dragOverClass; }
  @HostListener('drop', ['$event']) handleDrop(e: Event) { e.preventDefault(); this.dragClass = '' }

  @HostListener('mouseleave')
  @HostListener('dragleave')
  handleLeave() { this.dragClass = '' }

}
