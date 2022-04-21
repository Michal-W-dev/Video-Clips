import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';


@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>
  // classOnActive = tab.active ? 'bg-indigo-400 hover:bg-indigo-500 text-white': 'hover:text-indigo-300'
  constructor() { }

  ngAfterContentInit(): void {
    const activeTab = this.tabs?.find(tab => tab.active)
    // TODO
    if (!activeTab) this.selectTab(this.tabs!.last)
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach(tab => tab.active = false)
    tab.active = true;
  }

  classOnActive(tab: TabComponent) {
    return {
      'bg-indigo-400 hover:bg-indigo-500 text-white': tab.active,
      'hover:text-indigo-300': !tab.active
    }
  }

}
