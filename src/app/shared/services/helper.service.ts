import { Injectable } from '@angular/core'
import { Contact } from '@capacitor-community/contacts'

import { STORAGE_KEYS } from '../global-variables'

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  public getTemplateName(templateKey: string): string {
    if (templateKey === STORAGE_KEYS.DEFAULT_TEMPLATE) {
      return 'Default'
    }

    return templateKey.length > 9 ? templateKey.slice(9) : 'Default'
  }

  public sortContacts(contacts: Contact[]): Contact[] {
    const sortedContacts: Contact[] = contacts.sort(
      (a: Contact, b: Contact) => {
        const fa: string = a.displayName.toLowerCase()
        const fb: string = b.displayName.toLowerCase()

        if (fa < fb) {
          return -1
        }
        if (fa > fb) {
          return 1
        }
        return 0
      },
    )

    return sortedContacts
  }

  public sortKeys(keys: string[]): string[] {
    const sortedKeys: string[] = keys.sort((a: string, b: string) => {
      const fa: string = a.toLowerCase()
      const fb: string = b.toLowerCase()

      if (fa < fb) {
        return -1
      }
      if (fa > fb) {
        return 1
      }
      return 0
    })

    return sortedKeys
  }
}
