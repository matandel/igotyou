import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { IonicSelectableModule } from 'ionic-selectable'

import { HomePageRoutingModule } from './home-routing.module'
import { ElementsModule } from '../../components/elements/elements.module'
import { HomePage } from './home.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    HomePageRoutingModule,
    ElementsModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
