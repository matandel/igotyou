import { Component, OnInit, OnDestroy } from '@angular/core'
import { Platform } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { SplashScreen } from '@capacitor/splash-screen'

import { StorageService } from './shared/services/storage.service'
import { StatusBarService } from './shared/services/status-bar.service'

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
    private statusBarService: StatusBarService,
  ) {}

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
