import { Injectable } from '@angular/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { isPlatform } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  constructor() {}

  public async setStatusBar(isDarkMode: boolean = false): Promise<void> {
    if (isPlatform('android')) {
      window.addEventListener('statusTap', () => {})

      let style: Style = Style.Dark
      let color: string = '#211d21'

      if (isDarkMode) {
        style = Style.Light
        color = '#2fdf75'
      }

      await StatusBar.setStyle({ style })
      await StatusBar.setBackgroundColor({ color })
    }
  }
}
