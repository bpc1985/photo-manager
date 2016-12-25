import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { Photo } from '../../entities/photo';
import { PhotoLibraryService } from '../../services/local-photo-library.service';
import { CloudPhotoLibraryService } from '../../services/cloud-photo-library.service';

declare var window: any;
declare var cordova: any;

@Component({
  selector: 'uploaded-photos-list-page',
  templateUrl: 'uploaded-photos-list-page.component.html'
})

export class UploadedPhotosListPageComponent {
  photos: Photo[] = [];
  filter: string = "";
  filteredPhotos: Photo[];
  loading: any;
  backend: any;

  constructor(public navCtrl: NavController,
              private cloudBackend: CloudPhotoLibraryService,
              private loadingCtrl: LoadingController,
              private localBackend: PhotoLibraryService) {
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this._loadPhotos();
  }

  _loadPhotos() {
    this.cloudBackend.getPhotos().subscribe((cloudPhotos: Photo[]) => {
      this.localBackend.getPhotos().then((localPhotos: Photo[]) => {
        this.photos = cloudPhotos.concat(localPhotos);
        this.updateFilter();
        this.loading.dismiss();
      });
    });
  }

  deletePhoto(photo) {
    this.backend = photo.url.includes('firebase') ? this.cloudBackend : this.localBackend;
    this.backend.deletePhoto(photo.id).then(() => this._loadPhotos());
  }

  updateFilter($event?: any) {
    if ($event) {
      this.filter = $event.target.value;
    }

    if (this.filter) {
      let re = new RegExp(`${this.filter}`, 'gi');
      this.filteredPhotos = this.photos.filter(photo => {
        let test1 = re.test(photo.title);
        let test2 = re.test(photo.description);
        return test1 || test2;
      });
    } else {
      this.filteredPhotos = this.photos;
    }
  }
}