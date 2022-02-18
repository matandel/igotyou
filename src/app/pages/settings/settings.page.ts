import { Component, OnInit } from '@angular/core'

import { StorageService } from '../../shared/services/storage.service'
import { StatusBarService } from '../../shared/services/status-bar.service'
import { STORAGE_KEYS } from '../../shared/global-variables'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public darkMode: boolean = false

  constructor(
    private storageService: StorageService,
    private statusBarService: StatusBarService,
  ) {}

  public ngOnInit(): void {
    this.storageService.setLoadingData(true)
    this.getSavedMode()
  }

  private getSavedMode(): void {
    setTimeout(() => {
      this.storageService
        .get(STORAGE_KEYS.DARK_MODE)
        .subscribe((response: string) => {
          const storedData: string = response
          this.darkMode = JSON.parse(storedData)

          this.storageService.setLoadingData(false)
          this.toggleMode()
        })
    }, 200)
  }

  public toggleMode(): void {
    const currentMode: string = this.darkMode ? 'dark' : 'light'

    document.body.setAttribute('color-theme', currentMode)
    this.statusBarService.setStatusBar(this.darkMode)

    this.storageService.remove(STORAGE_KEYS.DARK_MODE)
    this.storageService.set(STORAGE_KEYS.DARK_MODE, this.darkMode)
  }

  public getToggleModeLabel(): string {
    return this.darkMode ? 'Dark' : 'Light'
  }
}
