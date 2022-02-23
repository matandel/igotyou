import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SaveTemplateModalComponent } from './save-template-modal/save-template-modal.component'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SaveTemplateModalComponent],
  exports: [SaveTemplateModalComponent],
})
export class ElementsModule {}
