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
    // TODO
    this.modals.push({ id, visible: false })
  }
  private findModal(id: string) { return this.modals.find(el => el.id === id) }

  unregister(id: string) {
    this.modals = this.modals.filter(el => el.id !== id)
  }

  isModal(id: string) {
    return !!this.findModal(id)?.visible
  }

  toggleModal(id: string) {
    const modal = this.findModal(id)
    if (modal) modal.visible = !modal.visible
  }
}
