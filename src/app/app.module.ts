import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { IonicModule } from '@ionic/angular'
import { Drivers } from '@ionic/storage'
import { IonicStorageModule } from '@ionic/storage-angular'
import { SMS } from '@ionic-native/sms/ngx'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'
import { AndroidShortcuts } from 'capacitor-android-shortcuts'

import { AppRoutingModule } from './app-routing.module'
import { LayoutModule } from './components/layout/layout.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '_iGotYouDB',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    LayoutModule,
  ],
  providers: [SMS, AndroidPermissions],
  bootstrap: [AppComponent],
})
export class AppModule {}
