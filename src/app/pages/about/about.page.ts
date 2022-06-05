import { Component, OnInit } from '@angular/core'

 import packageJson from '../../../../package.json'

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public version: string = packageJson.version

  constructor() {}

  ngOnInit() {}
}
