import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: IModal[] = [];
  constructor() { }
  registerModal(id: string) {
    this.modals.push({ id, visible: false })
    console.log('register', this.modals)
  }
  private findModal(id: string) { return this.modals.find(el => el.id === id) }

  unregister(id: string) {
    this.modals = this.modals.filter(el => el.id !== id)
    console.log('unregister', this.modals)
  }

  isModal(id: string) {
    console.log('isModal', this.modals)
    return !!this.findModal(id)?.visible
  }

  toggleModal(id: string) {
    console.log('toggle', this.modals)
    const modal = this.findModal(id)
    if (modal) modal.visible = !modal.visible
  }
}
