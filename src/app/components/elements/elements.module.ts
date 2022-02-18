import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SaveTemplateModalComponent } from './save-template-modal/save-template-modal.component'
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SaveTemplateModalComponent, ConfirmationModalComponent],
  exports: [SaveTemplateModalComponent, ConfirmationModalComponent],
})
export class ElementsModule {}
