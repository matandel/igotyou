import { Component, OnInit, ViewChild } from '@angular/core'
import { IonInput, isPlatform } from '@ionic/angular'
import { Keyboard } from '@capacitor/keyboard'
import {
  ActionSheet,
  ActionSheetButtonStyle,
  ShowActionsResult,
} from '@capacitor/action-sheet'

import { Template } from '../../shared/models/template.model'
import { StorageService } from '../../shared/services/storage.service'
import { HelperService } from '../../shared/services/helper.service'
import { ToastService } from '../../shared/services/toast.service'
import {
  DELETE_TEMPLATE_MESSAGE,
  STORAGE_KEYS,
  TEMPLATE_NAME_TAKEN_MESSAGE,
} from '../../shared/global-variables'

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})
export class TemplatesPage implements OnInit {
  @ViewChild('nameInput') private nameInput: IonInput

  private deletedTemplateKey: string
  public templateKeys: string[] = []
  public visibleTemplateKeys: string[] = []
  public editedTemplateKey: string
  public templateName: string = ''
  public searchString: string = ''

  constructor(
    private storageService: StorageService,
    private helperService: HelperService,
    private toastService: ToastService,
  ) {}

  public ngOnInit(): void {
    this.storageService.setLoadingData(true)
    this.clearTemplateName()
    this.checkStoredTemplates()
  }

  private checkStoredTemplates(): void {
    setTimeout(() => {
      this.storageService.getKeys().subscribe((response: string[]) => {
        const storedKeys: string[] = this.helperService.sortKeys(response)
        this.templateKeys = storedKeys.filter((key: string) =>
          key.startsWith(STORAGE_KEYS.TEMPLATE_PREFIX),
        )

        this.visibleTemplateKeys = [...this.templateKeys]

        if (this.searchString.length > 0) {
          this.filterTemplates()
        }

        this.storageService.setLoadingData(false)
      })
    }, 200)
  }

  public getTemplateName(templateKey: string): string {
    return this.helperService.getTemplateName(templateKey)
  }

  public enableTemplateEdit(templateKey: string): void {
    this.setTemplateName(templateKey)
    this.editedTemplateKey = templateKey

    setTimeout(async () => {
      if (this.nameInput) {
        this.nameInput.setFocus()
        if (isPlatform('android')) {
          Keyboard.show()
        }
      }
    }, 200)
  }

  public saveTemplateName(templateKey: string): void {
    if (
      this.templateKeys.some(
        (key: string) =>
          key === `${STORAGE_KEYS.TEMPLATE_PREFIX}${this.templateName}`,
      )
    ) {
      this.displayNameTakenWarning()
    } else {
      this.storageService.setLoadingData(true)
      this.editedTemplateKey = null

      this.storageService
        .get(templateKey)
        .subscribe((response: string) => {
          const storedData: string = response
          const editedTemplateData: Template = JSON.parse(storedData)

          const newTemplateKey: string = `${STORAGE_KEYS.TEMPLATE_PREFIX}${this.templateName}`

          this.storageService.remove(templateKey)
          this.storageService.set(newTemplateKey, editedTemplateData)

          for (const [
            index,
            value,
          ] of this.visibleTemplateKeys.entries()) {
            if (value === templateKey) {
              this.visibleTemplateKeys[index] = newTemplateKey
              break
            }
          }

          this.checkStoredTemplates()
        })
    }
  }

  public disableTemplateEdit(): void {
    this.editedTemplateKey = null

    if (isPlatform('android')) {
      Keyboard.hide()
    }
  }

  public confirmTemplateDelete(templateKey: string): void {
    this.deletedTemplateKey = templateKey
    this.showDeleteActions()
  }

  public async showDeleteActions(): Promise<void> {
    const showActionResult: ShowActionsResult =
      await ActionSheet.showActions({
        title: DELETE_TEMPLATE_MESSAGE,
        message: '',
        options: [
          {
            title: 'Delete',
            style: ActionSheetButtonStyle.Default,
          },
          {
            title: 'Cancel',
            style: ActionSheetButtonStyle.Cancel,
          },
        ],
      })

    switch (showActionResult.index) {
      case 0:
        this.deleteTemplate()
        break
      case 1:
      default:
        break
    }
  }

  public deleteTemplate(): void {
    if (this.deletedTemplateKey) {
      this.storageService.setLoadingData(true)
      this.storageService.remove(this.deletedTemplateKey)
      this.visibleTemplateKeys.splice(
        this.visibleTemplateKeys.indexOf(this.deletedTemplateKey),
        1,
      )

      this.isSelectedTemplateDeleted()
      this.checkStoredTemplates()
    }
  }

  private isSelectedTemplateDeleted(): void {
    this.storageService
      .get(STORAGE_KEYS.SELECTED_TEMPLATE)
      .subscribe((response: string) => {
        let selectedTemplateKey: string = JSON.parse(response)

        console.log(
          'deleted',
          selectedTemplateKey,
          this.deletedTemplateKey,
        )

        if (
          selectedTemplateKey &&
          selectedTemplateKey == this.deletedTemplateKey
        ) {
          this.storageService.set(
            STORAGE_KEYS.SELECTED_TEMPLATE,
            STORAGE_KEYS.DEFAULT_TEMPLATE,
          )
        }
      })
  }

  private clearTemplateName(): void {
    this.templateName = ''
  }

  private setTemplateName(templateKey: string): void {
    this.templateName = this.helperService.getTemplateName(templateKey)
  }

  public filterTemplates(): void {
    this.visibleTemplateKeys = [
      ...this.templateKeys.filter((key: string) =>
        key.slice(9).includes(this.searchString),
      ),
    ]
  }

  private displayNameTakenWarning(): void {
    this.toastService.show(TEMPLATE_NAME_TAKEN_MESSAGE, 'warning')
  }
}
