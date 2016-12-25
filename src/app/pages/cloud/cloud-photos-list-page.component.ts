import { Component, Inject } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Camera, File, FileEntry } from 'ionic-native';
import { FirebaseApp } from 'angularfire2';

import { Photo } from '../../entities/photo';
import { CloudPhotoLibraryService } from '../../services/cloud-photo-library.service';
//import { PhotoDetailsPageComponent } from 'photo-details-page/photo-details-page.component';

import 'whatwg-fetch';

declare var window: any;

@Component({
  selector: 'cloud-photos-list-page',
  templateUrl: 'cloud-photos-list-page.component.html'
})

export class CloudPhotosListPageComponent {
  photos: Photo[] = [];
  filter: string = '';
  filteredPhotos: Photo[] = this.photos;
  firebase: any;
  loading: any;

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private backend: CloudPhotoLibraryService,
              @Inject(FirebaseApp) firebase: any) {
    this.firebase = firebase;
    
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
    this._loadPhotos();
  }

  _loadPhotos() {
    this.backend.getPhotos().subscribe((photos: Photo[]) => {
      this.photos = photos;
      this.updateFilter();
      this.loading.dismiss();
    });
  }

  openPhotoDetailsPage(photo: Photo) {
    //this.navCtrl.push(PhotoDetailsPageComponent, { photo });
  }

  addPhotoFromCamera() {
    Camera.getPicture({
      quality: 25,
      destinationType: Camera.DestinationType.FILE_URI,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200
    })
    .then(imagePath => {
      this.savePhotoToCloud(imagePath);
    }, error => {
      console.log("Camera API ERROR: " + error);
    });
  }

  savePhotoToCloud(imagePath) {
    this.makeFileIntoBlob(imagePath)
      .then(imageBlob => this.uploadToFirebase(imageBlob));
  }

  makeFileIntoBlob(imagePath): Promise<any> {
    const fail = error => alert('failed: ' + JSON.stringify(error));

    if (this.platform.is('android')) {
      const onSuccess = fileEntry => {
        return new Promise((resolve, reject) => {
          fileEntry.file(resFile => {
            const reader = new FileReader();
            reader.onloadend = (evt: any) => {
              const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
              resolve(imgBlob);
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(resFile);
          });
        });
      };

      return this.platform.ready().then(() => {
        return File.resolveLocalFilesystemUrl(imagePath)
          .then((fileEntry: FileEntry) => onSuccess(fileEntry))
          .catch(error => fail(error));
      });
    } else {
      return fetch(imagePath)
        .then(response => response.blob())
        .catch(error => fail(error));
    }
  }

  uploadToFirebase(imageBlob) {
    let id = Math.random().toString(36).substr(2, 30) ;
    let uploadTask = this.firebase.storage().ref(`/photos/${id}`).put(imageBlob);
    
    uploadTask.on('state_changed', snapshot => {
      //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
    }, error => {
      console.log('Upload ERROR: ', error);
    }, () => {
      const url = uploadTask.snapshot.downloadURL;
      this.savePhoto(id, url);
    });
  }

  savePhoto(id, url) {
    let photo = <Photo> {
      id: id,
      title: 'title ' + id,
      description: `A user has recently added this photo`,
      url: url,
      created: new Date(),
      starred: false
    };

    this.backend.addPhoto(photo).then(() => {
      this.backend.getPhotos().subscribe(photos => {
        this.photos = photos;
        this.updateFilter();
      });
    });
  }

  deletePhoto(photoId) {
    this.backend.deletePhoto(photoId).then(() => this._loadPhotos());
  }

  editPhoto(photo) {
    this.backend.updatePhoto(photo);
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