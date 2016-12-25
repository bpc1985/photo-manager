import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { Photo } from '../../entities/photo';
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
  filter: string = "";
  filteredPhotos: Photo[] = this.photos;

  constructor(public navCtrl: NavController,
              private cd: ChangeDetectorRef,
              private backend: PhotoLibraryService) {
  }

  ionViewWillEnter() {
    this.backend.getPhotos().then((photos: Photo[]) => {
      this.photos = photos;
      console.log('photos: ', photos.length);
      this.updateFilter();
    });
  }

  openPhotoDetailsPage(photo: Photo) {
    this.navCtrl.push(PhotoDetailsPageComponent, { photo });
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
    return this.backend.addPhoto(photo);
  }
  
  getFileContentAsBase64(path, callback) {
    const fail = error => alert('failed: ' + JSON.stringify(error));

    const gotFile = fileEntry => {
      fileEntry.file(file => {
        const reader = new FileReader();
        reader.onloadend = (evt: any) => {
          const content = evt.target.result;
          callback(content);
        };
        reader.readAsDataURL(file);
      });
    }

    window.resolveLocalFileSystemURL(path, gotFile, fail);
  }

  copyPhotoToLocal(fileURI) {
    const newName = Math.random().toString(36).substr(2, 30);
    const fail = error => alert('fail: ' + error.code);
 
    const onCopySuccess = entry => {
      this.getFileContentAsBase64(entry.nativeURL, base64Image => {
        this.savePhoto(newName, base64Image).then(() => {
          this.backend.getPhotos().then((photos: Photo[]) => {
            this.photos = photos;
            this.updateFilter();
            this.cd.detectChanges();
          });
        });
      });
    };

		const copyFile = fileEntry => {
			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, fileSystem2 => {
				fileEntry.copyTo(fileSystem2, newName + '.jpg', onCopySuccess, fail);
			}, fail);
		}

    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
  }

  addPhotoFromCamera() {
    Camera.getPicture({
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG
    })
    .then((fileURI) => {
      this.copyPhotoToLocal(fileURI);
    },
    function onError(error) {
      console.log("Camera API ERROR: " + error);
    });
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
