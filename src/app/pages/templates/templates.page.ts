import { Component, OnInit, ViewChild } from '@angular/core'
import { IonInput, isPlatform } from '@ionic/angular'
import { Keyboard } from '@capacitor/keyboard'

import { StorageService } from '../../shared/services/storage.service'
import { HelperService } from '../../shared/services/helper.service'
import { Template } from '../../shared/models/template.model'
import { DELETE_TEMPLATE_MESSAGE } from '../../shared/global-variables'

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
  public deleteConfirmationMessage: string = DELETE_TEMPLATE_MESSAGE
  public searchString: string = ''

  public showConfirmationModal: boolean = false

  constructor(
    private storageService: StorageService,
    private helperService: HelperService,
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
          key.startsWith('template-'),
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
    this.clearTemplateName()
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
    this.storageService.setLoadingData(true)
    this.editedTemplateKey = null
    this.storageService.get(templateKey).subscribe((response: string) => {
      const storedData: string = response
      const editedTemplateData: Template = JSON.parse(storedData)

      const newTemplateKey: string = `template-${this.templateName}`

      this.storageService.remove(templateKey)
      this.storageService.set(newTemplateKey, editedTemplateData)

      for (const [index, value] of this.visibleTemplateKeys.entries()) {
        if (value === templateKey) {
          this.visibleTemplateKeys[index] = newTemplateKey
          break
        }
      }

      this.checkStoredTemplates()
    })
  }

  public confirmTemplateDelete(templateKey: string): void {
    this.setModalVisibility(true)
    this.deletedTemplateKey = templateKey
  }

  public deleteTemplate(): void {
    if (this.deletedTemplateKey) {
      this.storageService.setLoadingData(true)
      this.storageService.remove(this.deletedTemplateKey)
      this.visibleTemplateKeys.splice(
        this.visibleTemplateKeys.indexOf(this.deletedTemplateKey),
        1,
      )
      this.checkStoredTemplates()
      this.setModalVisibility(false)
    }
  }

  private clearTemplateName(): void {
    this.templateName = ''
  }

  private setTemplateName(templateKey: string): void {
    this.templateName = this.helperService.getTemplateName(templateKey)
  }

  public setModalVisibility(modalVisible: boolean): void {
    this.showConfirmationModal = modalVisible
  }

  public filterTemplates(): void {
    this.visibleTemplateKeys = [
      ...this.templateKeys.filter((key: string) =>
        key.slice(9).includes(this.searchString),
      ),
    ]
  }
}
