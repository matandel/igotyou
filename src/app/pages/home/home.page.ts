import { Component, OnInit } from '@angular/core'
import {
  isPlatform,
  Platform,
  ActionSheetController,
} from '@ionic/angular'
import { Contacts, Contact } from '@capacitor-community/contacts'
import { IonicSelectableComponent } from 'ionic-selectable'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'

import { Template } from '../../shared/models/template.model'
import { SelectItem } from '../../shared/interfaces/select-item.interface'
import { StorageService } from '../../shared/services/storage.service'
import { SmsService } from '../../shared/services/sms.service'
import { HelperService } from '../../shared/services/helper.service'
import {
  DEFAULT_TEMPLATE_ITEM,
  STORAGE_KEYS,
} from '../../shared/global-variables'

interface SelectableComponentEvent {
  component: IonicSelectableComponent
  value: any
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private phoneNumbers: string[]
  public currentTemplate: Template
  public contacts: Contact[] = []
  public selectedContacts: SelectItem[] = []
  public contactList: SelectItem[] = []
  public selectedTemplateKey: SelectItem = DEFAULT_TEMPLATE_ITEM

  public templateList: SelectItem[] = []
  public templateKeys: string[] = []
  public showSaveTemplateModal: boolean = false

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private actionSheetController: ActionSheetController,
    private storageService: StorageService,
    private smsService: SmsService,
    private helperService: HelperService,
  ) {}

  public ngOnInit(): void {
    this.storageService.setLoadingData(true)
    this.platform.ready().then(async () => {
      if (isPlatform('android')) {
        let permission = await Contacts.getPermissions()

        if (!permission.granted) {
          await this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_CONTACTS,
          )
        }
      }

      this.clearTemplate()
      this.loadContacts()
      this.checkStoredTemplates()
    })
  }

  private async loadContacts(): Promise<void> {
    if (isPlatform('android')) {
      Contacts.getContacts().then((result: { contacts: Contact[] }) => {
        const sortedContacts: Contact[] = this.helperService.sortContacts(
          result.contacts,
        )

        this.contacts = sortedContacts.filter(
          (contact: Contact) => contact.phoneNumbers.length > 0,
        )

        this.contactList = this.contacts.map((contact: Contact) => {
          return {
            value: contact.phoneNumbers[0].number,
            label: contact.displayName,
          } as SelectItem
        })
      })
    } else {
      this.contacts = []
      this.contactList = []
    }
  }

  private checkStoredTemplates(): void {
    setTimeout(() => {
      this.storageService.getKeys().subscribe((response: string[]) => {
        const storedKeys: string[] = response

        this.templateKeys = storedKeys.filter((key: string) =>
          key.startsWith(STORAGE_KEYS.TEMPLATE_PREFIX),
        )
        this.setTemplateList()
        this.checkDefaultTemplate()
      })
    }, 200)
  }

  private checkStoredForm(templateKey: string): void {
    setTimeout(() => {
      this.storageService
        .get(templateKey)
        .subscribe((response: string) => {
          const storedData: string = response
          const storedTemplate: Template = JSON.parse(storedData)

          this.checkCurrentTemplate(storedTemplate)
          this.storageService.setLoadingData(false)
        })
    }, 200)
  }

  private checkCurrentTemplate(storedData: Template): void {
    if (!storedData) {
      this.clearTemplate()
    } else {
      this.setStoredData(storedData)
    }
  }

  private setStoredData(storedData: Template): void {
    this.currentTemplate = { ...storedData }
    this.phoneNumbers = [...this.currentTemplate.numbers]

    const storedContacts: string[] = this.currentTemplate.contacts
      ? [...this.currentTemplate.contacts]
      : []

    const tempContactList: SelectItem[] = []
    this.contacts.forEach((contact: Contact) => {
      if (
        contact.phoneNumbers.length > 0 &&
        storedContacts.indexOf(contact.phoneNumbers[0].number) > -1
      ) {
        tempContactList.push({
          value: contact.phoneNumbers[0].number,
          label: contact.displayName,
        })
      }
    })

    this.selectedContacts = [...tempContactList]
  }

  public selectTemplate(selectEvent: SelectableComponentEvent): void {
    this.storageService.setLoadingData(true)

    if (!selectEvent.value) {
      return
    }

    let keyValue: string = selectEvent.value.value

    keyValue =
      keyValue && keyValue.length > 0
        ? keyValue
        : STORAGE_KEYS.DEFAULT_TEMPLATE

    this.storageService.set(STORAGE_KEYS.SELECTED_TEMPLATE, keyValue)

    this.selectedTemplateKey = {
      value: keyValue,
      label: this.helperService.getTemplateName(keyValue),
    }

    this.checkStoredForm(keyValue)
  }

  public addTemplateNumber(): void {
    if (
      this.currentTemplate &&
      this.currentTemplate.numbers &&
      this.currentTemplate.numbers.length < 5
    )
      this.currentTemplate.numbers.push('')
  }

  public updateTemplateNumber(event: Event, index: number): void {
    this.phoneNumbers[index] = event as unknown as string
  }

  public removeTemplateNumber(index: number): void {
    this.currentTemplate.numbers.splice(index, 1)
    this.phoneNumbers[index] = ''
  }

  public clearTemplate(): void {
    this.currentTemplate = new Template('', '', [''], [''], false, '')
    this.phoneNumbers = ['', '', '', '', '']
    this.selectedContacts = []
  }

  public storeFormData(): void {
    if (
      this.selectedTemplateKey &&
      this.selectedTemplateKey.value &&
      this.selectedTemplateKey.value.length > 0 &&
      this.selectedTemplateKey.value !== 'storedFormData'
    ) {
      this.storageService.remove(this.selectedTemplateKey.value)
      const templateName: string = this.helperService.getTemplateName(
        this.selectedTemplateKey.value,
      )

      this.saveTemplate(templateName)
    } else {
      this.setModalVisibility(true)
    }
  }

  public selectContacts(event: SelectableComponentEvent): void {
    if (event.value) {
      this.selectedContacts = event.value
    }
  }

  public setModalVisibility(modalVisible: boolean): void {
    this.showSaveTemplateModal = modalVisible
  }

  public async showSaveActions(): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement =
      await this.actionSheetController.create({
        header: 'How do you want to save this data?',
        buttons: [
          {
            text: 'Add as a new template',
            icon: 'add',
            handler: () => {
              this.setModalVisibility(true)
            },
          },
          {
            text: 'Update current template',
            icon: 'create',
            handler: () => {
              this.storeTemplate(this.selectedTemplateKey.value)
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {},
          },
        ],
      })

    await actionSheet.present()
  }

  public saveTemplate(templateName: string): void {
    this.storageService.setLoadingData(true)
    this.showSaveTemplateModal = false

    const newTemplateKey: string =
      templateName === STORAGE_KEYS.DEFAULT_TEMPLATE
        ? templateName
        : `${STORAGE_KEYS.TEMPLATE_PREFIX}${templateName}`

    this.storeTemplate(newTemplateKey)

    if (!this.templateKeys.some((key: string) => key === newTemplateKey)) {
      this.templateKeys.push(newTemplateKey)
    }
    this.setTemplateList()

    this.storageService.set(STORAGE_KEYS.SELECTED_TEMPLATE, newTemplateKey)

    this.selectedTemplateKey = {
      value: newTemplateKey,
      label: this.helperService.getTemplateName(newTemplateKey),
    }
  }

  private storeTemplate(storageKey: string): void {
    this.currentTemplate.name = storageKey
    this.currentTemplate.numbers = this.phoneNumbers.filter(
      (number: string) => number.length > 0,
    )
    this.currentTemplate.contacts = this.selectedContacts.map(
      (contact: SelectItem) => contact.value,
    )

    this.storageService.remove(storageKey)
    this.storageService.set(storageKey, this.currentTemplate)
    this.storageService.setLoadingData(false)
  }

  public async sendTemplate(): Promise<void> {
    this.storageService.setLoadingData(true)
    const numberList: string[] = []

    this.phoneNumbers.forEach((number: string) => {
      if (number.length > 0) {
        numberList.push(number)
      }
    })

    this.selectedContacts.forEach((contact: SelectItem) => {
      if (contact.value.length > 0) {
        numberList.push(contact.value)
      }
    })

    this.smsService.sendSms(
      numberList,
      this.currentTemplate.message,
      this.currentTemplate.includeLocation,
    )
  }

  public disableActions(): boolean {
    return (
      this.currentTemplate.message.length === 0 ||
      (this.currentTemplate.numbers.length === 0 &&
        this.currentTemplate.contacts.length === 0)
    )
  }

  public getTemplateName(templateKey: string): string {
    return this.helperService.getTemplateName(templateKey)
  }

  public setTemplateList(): void {
    const selectItems: SelectItem[] = [DEFAULT_TEMPLATE_ITEM]

    this.templateKeys.forEach((key: string) => {
      selectItems.push({
        value: key,
        label: this.helperService.getTemplateName(key),
      })
    })

    this.templateList = [...selectItems]
  }

  private checkDefaultTemplate(): void {
    this.storageService
      .get(STORAGE_KEYS.SELECTED_TEMPLATE)
      .subscribe((response: string) => {
        let selectedTemplateKey: string = JSON.parse(response)

        if (
          !selectedTemplateKey ||
          !this.templateKeys.some(
            (key: string) => key === selectedTemplateKey,
          )
        ) {
          selectedTemplateKey = STORAGE_KEYS.DEFAULT_TEMPLATE
        }

        this.selectedTemplateKey = {
          value: selectedTemplateKey,
          label: this.helperService.getTemplateName(selectedTemplateKey),
        }

        this.checkStoredForm(selectedTemplateKey)
        this.storageService.setLoadingData(false)
      })
  }
}
