import { Component } from '@angular/core';

import { CloudPhotosListPageComponent } from '../cloud/cloud-photos-list-page.component';
import { UploadedPhotosListPageComponent } from '../uploaded/uploaded-photos-list-page.component';
import { LocalPhotosListPageComponent } from '../local/local-photos-list-page.component';

@Component({
  templateUrl: 'photo-tabs-page.component.html'
})
export class PhotoTabsPageComponent {

  tab1Root: any = CloudPhotosListPageComponent;
  tab2Root: any = UploadedPhotosListPageComponent;
  tab3Root: any = LocalPhotosListPageComponent;

  constructor() {
  }
}
