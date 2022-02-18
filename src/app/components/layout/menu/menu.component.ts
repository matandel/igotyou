import { Component, EventEmitter, OnInit, Output } from '@angular/core'

interface Page {
  title: string
  url: string
  icon: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() pageTitleUpdated: EventEmitter<string> = new EventEmitter()

  public appPages: Page[] = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'My Templates', url: '/templates', icon: 'cloud' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
    { title: 'About', url: '/about', icon: 'information-circle' },
  ]

  constructor() {}

  public ngOnInit() {}

  public updatePageTitle(pageTitle: string): void {
    this.pageTitleUpdated.emit(pageTitle)
  }
}
