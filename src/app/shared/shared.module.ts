import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { DragEventDirective } from './directives/drag-event.directive';
import { PingComponent } from './ping/ping.component';



@NgModule({
  declarations: [ModalComponent, TabsContainerComponent, TabComponent, InputComponent, AlertComponent, DragEventDirective, PingComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ModalComponent, TabsContainerComponent, TabComponent, InputComponent, AlertComponent, DragEventDirective, PingComponent]
})
export class SharedModule { }
