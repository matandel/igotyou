import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'

import { ToastService } from '../../../shared/services/toast.service'
import {
  STORAGE_KEYS,
  TEMPLATE_NAME_TAKEN_MESSAGE,
} from '../../../shared/global-variables'

@Component({
  selector: 'app-save-template-modal',
  templateUrl: './save-template-modal.component.html',
  styleUrls: ['./save-template-modal.component.scss'],
})
export class SaveTemplateModalComponent implements OnInit {
  @Input() public isModalOpen: boolean = false
  @Input() public templateKeys: string[] = []
  @Output() public saveTemplateEmitter: EventEmitter<string> =
    new EventEmitter()
  @Output() public closeModalEmitter: EventEmitter<void> =
    new EventEmitter()

  public templateName: string = ''

  constructor(private toastService: ToastService) {}

  public ngOnInit(): void {
    this.clearTemplateName()
  }

  public saveTemplate(): void {
    if (
      this.templateKeys.some(
        (templateKey: string) =>
          templateKey ===
          `${STORAGE_KEYS.TEMPLATE_PREFIX}${this.templateName}`,
      )
    ) {
      this.displayNameTakenWarning()
    } else {
      this.saveTemplateEmitter.emit(this.templateName)
    }

    this.clearTemplateName()
  }

  public closeModal(): void {
    this.closeModalEmitter.emit()
    this.clearTemplateName()
  }

  private clearTemplateName(): void {
    this.templateName = ''
  }

  private displayNameTakenWarning(): void {
    this.toastService.show(TEMPLATE_NAME_TAKEN_MESSAGE, 'warning')
  }
}
