import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { Photo } from '../../entities/photo';
import { BlobUtilService } from '../../services/blob-util.service';
import { PhotoLibraryService } from '../../services/local-photo-library.service';
import { PhotoDetailsPageComponent } from '../common/photo-details-page/photo-details-page.component';

import 'whatwg-fetch';

declare var window: any;
declare var cordova: any;

@Component({
  selector: 'local-photos-list-page',
  templateUrl: 'local-photos-list-page.component.html'
})

export class LocalPhotosListPageComponent {
  photos: Photo[] = [];
  filter: string = '';
  filteredPhotos: Photo[] = this.photos;
  loading: any;

  constructor(public navCtrl: NavController,
              private cd: ChangeDetectorRef,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private blobUtilService: BlobUtilService,
              private backend: PhotoLibraryService) {

  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this._loadPhotos();
  }

  _loadPhotos() {
    this.backend.getPhotos().then((photos: Photo[]) => {
      this.photos = photos;
      this.updateFilter();
      this.cd.detectChanges();
      this.loading.dismiss();
    });
  }

  _savePhoto(id, url) {
    let photo = <Photo> {
      id: id,
      title: 'title ' + id,
      description: `A user has recently added this photo`,
      url: url,
      created: new Date(),
      starred: false
    };
    return this.backend.addPhoto(photo);
  }

  deletePhoto(photoId) {
    this.backend.deletePhoto(photoId).then(() => this._loadPhotos());
  }

  editPhoto(photo) {
    this.backend.updatePhoto(photo);
  }

  _copyPhotoToLocalDB(imageData) {
    const id = Math.random().toString(36).substr(2, 30);
    const base64Image = this.blobUtilService.convertToBase64String(imageData);
    return this._savePhoto(id, base64Image);
  }

  addPhotoFromCamera() {
    Camera.getPicture({
      quality: 25,
      destinationType: Camera.DestinationType.DATA_URL,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200
    })
    .then(imageData => this._copyPhotoToLocalDB(imageData))
    .then(() => this._loadPhotos())
    .catch(e => alert('Error: ' + JSON.stringify(e)));
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

  openPhotoDetailsPage(photo: Photo) {
    this.navCtrl.push(PhotoDetailsPageComponent, { photo });
  }
}
