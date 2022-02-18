import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { RouterModule, RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { MenuComponent } from './menu/menu.component'
import { ToolbarComponent } from './toolbar/toolbar.component'

@NgModule({
  imports: [BrowserModule, CommonModule, RouterModule, IonicModule],
  declarations: [MenuComponent, ToolbarComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  exports: [MenuComponent, ToolbarComponent],
})
export class LayoutModule {}
