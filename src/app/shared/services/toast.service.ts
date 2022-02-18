import { Injectable } from '@angular/core'
import { ToastController } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  public async show(
    message: string,
    color?: string,
    duration?: number,
  ): Promise<void> {
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      duration: duration || 3000,
      icon: 'information-circle',
      position: 'top',
      color: color || 'primary',
    })

    toast.present()
  }
}
