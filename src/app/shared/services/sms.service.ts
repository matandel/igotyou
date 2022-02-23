import { Injectable } from '@angular/core'
import { isPlatform } from '@ionic/angular'
import { SMS } from '@ionic-native/sms/ngx'
import { Geolocation } from '@capacitor/geolocation'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'

import { StorageService } from './storage.service'
import { ToastService } from './toast.service'
import {
  MAPS_URL,
  SMS_MESSAGE_HEADER,
  SMS_SUCCESS_MESSAGE,
  SMS_FAIL_MESSAGE,
  STORAGE_KEYS,
  TEMPLATE_MISSING_MESSAGE,
  LOCATION_PERMISSIONS_MISSING,
  SMS_PERMISSIONS_MISSING,
} from '../global-variables'
import { Template } from '../models/template.model'

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private templateKeys: string[] = []

  constructor(
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    private storageService: StorageService,
    private toastService: ToastService,
  ) {}

  public async sendSms(
    numberList: string[],
    message: string,
    includeLocation: boolean,
  ): Promise<any> {
    if (!isPlatform('android')) {
      this.storageService.setLoadingData(false)
      return
    }

    let formattedMessage: string = `${SMS_MESSAGE_HEADER}\n\nMessage: ${message}`
    let permissionState: { hasPermission: boolean }

    if (includeLocation) {
      permissionState = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      )

      if (!permissionState.hasPermission) {
        await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        )

        permissionState = await this.androidPermissions.checkPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        )

        if (!permissionState.hasPermission) {
          this.toastService.show(LOCATION_PERMISSIONS_MISSING, 'danger')
          this.storageService.setLoadingData(false)
        }
      }

      const coordinates = await Geolocation.getCurrentPosition()
      if (
        coordinates.coords &&
        coordinates.coords.latitude &&
        coordinates.coords.longitude
      ) {
        formattedMessage += `\n\n${MAPS_URL}${coordinates.coords.latitude}${coordinates.coords.longitude}`
      }
    }

    permissionState = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.SEND_SMS,
    )

    if (!permissionState.hasPermission) {
      await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.SEND_SMS,
      )

      permissionState = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.SEND_SMS,
      )

      if (!permissionState.hasPermission) {
        this.toastService.show(SMS_PERMISSIONS_MISSING, 'danger')
        this.storageService.setLoadingData(false)
      }
    }

    for (let i = 0; i < numberList.length; i++) {
      setTimeout(() => {
        this.sms
          .send(numberList[i], formattedMessage)
          .then(() => {
            if (i === numberList.length - 1) {
              this.storageService.setLoadingData(false)
              this.toastService.show(SMS_SUCCESS_MESSAGE, 'success')
            }
          })
          .catch(() => {
            if (i === numberList.length - 1) {
              this.storageService.setLoadingData(false)
              this.toastService.show(SMS_FAIL_MESSAGE, 'danger')
            }
          })
      }, 200)
    }
  }

  public sendStoredSMS(): void {
    this.storageService.setLoadingData(true)

    setTimeout(() => {
      this.storageService.getKeys().subscribe((response: string[]) => {
        const storedKeys: string[] = response

        this.templateKeys = storedKeys.filter((key: string) =>
          key.startsWith(STORAGE_KEYS.TEMPLATE_PREFIX),
        )
        this.checkDefaultTemplate()
      })
    }, 200)
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
          this.storageService.setLoadingData(false)
          this.toastService.show(TEMPLATE_MISSING_MESSAGE, 'danger')
          return
        }

        this.checkStoredForm(selectedTemplateKey)
      })
  }

  private checkStoredForm(templateKey: string): void {
    this.storageService.get(templateKey).subscribe((response: string) => {
      const storedTemplate: Template = JSON.parse(response)

      if (
        storedTemplate &&
        (storedTemplate.contacts.length > 0 ||
          storedTemplate.numbers.length > 0)
      ) {
        this.sendSms(
          [...storedTemplate.contacts, ...storedTemplate.numbers],
          storedTemplate.message,
          storedTemplate.includeLocation,
        )
      }

      this.storageService.setLoadingData(false)
    })
  }
}
