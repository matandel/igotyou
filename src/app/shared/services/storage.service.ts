import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage-angular'
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageReady = new BehaviorSubject(false)

  private loadingData: boolean = false
  public loadingDataChange: Subject<boolean> = new Subject<boolean>()

  private shortcutMode: boolean = false
  public shortcutModeChange: Subject<boolean> = new Subject<boolean>()

  constructor(private storage: Storage) {
    this.init()
  }

  public async init(): Promise<void> {
    await this.storage.create()
    this.storageReady.next(true)
  }

  public set(key: string, value: any): void {
    const stringifiedValue: string = JSON.stringify(value)
    this.storage.set(key, stringifiedValue)
  }

  public get(key: string): Observable<string> {
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {
        return from(this.storage.get(key)) || of('')
      }),
    )
  }

  public getKeys(): Observable<string[]> {
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {
        return from(this.storage.keys()) || of([])
      }),
    )
  }

  public remove(key: string): void {
    this.storage.remove(key)
  }

  public clear(): void {
    this.storage.clear()
  }

  public setLoadingData(loadingData: boolean): void {
    this.loadingData = loadingData
    this.loadingDataChange.next(loadingData)
  }

  public getLoadingData(): boolean {
    return this.loadingData
  }

  public setShortcutMode(shortcutMode: boolean): void {
    this.shortcutMode = shortcutMode
    this.shortcutModeChange.next(shortcutMode)
  }

  public getShortcutMode(): boolean {
    return this.shortcutMode
  }
}
