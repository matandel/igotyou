import { Component, OnInit, OnDestroy } from '@angular/core'
import { isPlatform, Platform } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { SplashScreen } from '@capacitor/splash-screen'
import { AndroidShortcuts } from 'capacitor-android-shortcuts'

import { StorageService } from './shared/services/storage.service'
import { SmsService } from './shared/services/sms.service'
import { StatusBarService } from './shared/services/status-bar.service'
import { SMS_SHORTCUT } from './shared/global-variables'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private loadingDataSubscription: Subscription
  private darkModeKey: string = 'isDarkMode'
  public loadingData: boolean = false
  public pageTitle: string

  constructor(
    private platform: Platform,
    private storageService: StorageService,
    private smsService: SmsService,
    private statusBarService: StatusBarService,
  ) {
    this.addSmsShortcut()
  }

  public async ngOnInit(): Promise<void> {
    await SplashScreen.show()

    this.platform.ready().then(() => {
      this.getSavedMode()
      this.pageTitle = window.location.href.split('/').pop()
      this.subscribeToLoadingData()
    })
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromLoadingDat()
  }

  private addSmsShortcut(): void {
    if (isPlatform('android')) {
      AndroidShortcuts.isDynamicSupported().then(({ result }) => {
        if (result) {
          AndroidShortcuts.addDynamic({
            items: [
              {
                id: SMS_SHORTCUT.NAME,
                shortLabel: SMS_SHORTCUT.SHORT_LABEL,
                longLabel: SMS_SHORTCUT.LONG_LABEL,
                icon: {
                  type: 'Bitmap',
                  name: '<base64-string>',
                },
                data: SMS_SHORTCUT.NAME,
              },
            ],
          })
        }
      })

      this.addSmsShortcutListener()
    }
  }

  private addSmsShortcutListener(): void {
    AndroidShortcuts.addListener(
      'shortcut',
      (response: { data: string }) => {
        if (response.data === SMS_SHORTCUT.NAME) {
          setTimeout(() => {
            this.smsService.sendStoredSMS()
          }, 200)
        }
      },
    )
  }

  public setPageTitle(title: string): void {
    this.pageTitle = title
  }

  private subscribeToLoadingData(): void {
    this.loadingDataSubscription =
      this.storageService.loadingDataChange.subscribe(
        (loadingData: boolean) => {
          this.loadingData = loadingData
        },
      )
  }

  private unsubscribeFromLoadingDat(): void {
    this.loadingDataSubscription.unsubscribe()
  }

  private getSavedMode(): void {
    setTimeout(() => {
      this.storageService
        .get(this.darkModeKey)
        .subscribe((response: string) => {
          const storedData: string = response
          const darkMode: boolean = JSON.parse(storedData)
          this.toggleMode(darkMode)
        })
    }, 200)
  }

  private toggleMode(darkMode: boolean): void {
    const currentMode: string = darkMode ? 'dark' : 'light'
    document.body.setAttribute('color-theme', currentMode)
    this.statusBarService.setStatusBar(darkMode)
  }
}
