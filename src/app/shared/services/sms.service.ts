import { Injectable } from '@angular/core'
import { SMS } from '@ionic-native/sms/ngx'
import { Geolocation } from '@capacitor/geolocation'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'

import { StorageService } from './storage.service'
import { ToastService } from './toast.service'
import { MAPS_URL, SMS_MESSAGE_HEADER } from '../global-variables'
import { isPlatform } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class SmsService {
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
        this.toastService.show(
          'Permission to send SMS not granted',
          'danger',
        )
      }
    }

    for (let i = 0; i < numberList.length; i++) {
      setTimeout(() => {
        this.sms
          .send(numberList[i], formattedMessage)
          .then(response => {
            if (i === numberList.length - 1) {
              this.storageService.setLoadingData(false)
              this.toastService.show(
                'Text message sent successfully!',
                'success',
              )
            }
          })
          .catch(error => {
            if (i === numberList.length - 1) {
              this.storageService.setLoadingData(false)
              this.toastService.show(
                'Sending text  message failed! Please try again.',
                'danger',
              )
            }
          })
      }, 200)
    }
  }
}
