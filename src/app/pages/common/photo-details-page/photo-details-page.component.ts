import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams } from 'ionic-angular';

import { Photo } from '../../../entities/photo';
import { PhotoLibraryService } from '../../../services/local-photo-library.service';

declare var window: any;

@Component({
  selector: 'photo-details-page',
  templateUrl: 'photo-details-page.component.html'
})

export class PhotoDetailsPageComponent {
  photo: Photo = null;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private domSanitizer: DomSanitizer,
              private backend: PhotoLibraryService) {
  }

  ionViewDidLoad() {
    this.photo = this.navParams.get('photo');
  }

  displayImage(base64Image: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(base64Image);
  }

  back() {
     this.navCtrl.pop();
  }

  deletePhoto() {
    this.backend.deletePhoto(this.photo.id).then(() => this.back());
  }

  toggleStar() {
    this.photo.starred = !this.photo.starred;
    this.backend.updatePhoto(this.photo);
  }
 }