import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { FirebaseModule } from './firebase';

import { PhotoLibraryService } from './services/local-photo-library.service';
import { CloudPhotoLibraryService } from './services/cloud-photo-library.service';
import { BlobUtilService } from './services/blob-util.service';

import { MyApp } from './app.component';
import { PhotoTabsPageComponent } from './pages/tabs/photo-tabs-page.component';
import { LocalPhotosListPageComponent } from './pages/local/local-photos-list-page.component';
import { CloudPhotosListPageComponent } from './pages/cloud/cloud-photos-list-page.component';
import { UploadedPhotosListPageComponent } from './pages/uploaded/uploaded-photos-list-page.component';
import { PhotoListItemComponent } from './pages/common/photo-list-item/photo-list-item.component';
import { PhotoDetailsPageComponent } from './pages/common/photo-details-page/photo-details-page.component';

import { __platform_browser_private__ } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MyApp,
    PhotoTabsPageComponent,
    LocalPhotosListPageComponent,
    CloudPhotosListPageComponent,
    UploadedPhotosListPageComponent,
    PhotoListItemComponent,
    PhotoDetailsPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FirebaseModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PhotoTabsPageComponent,
    LocalPhotosListPageComponent,
    CloudPhotosListPageComponent,
    UploadedPhotosListPageComponent,
    PhotoListItemComponent,
    PhotoDetailsPageComponent
  ],
  providers: [
    Storage, PhotoLibraryService, CloudPhotoLibraryService, BlobUtilService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    __platform_browser_private__.BROWSER_SANITIZATION_PROVIDERS
  ]
})

export class AppModule {}
