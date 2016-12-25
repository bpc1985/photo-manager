import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Photo } from '../../../entities/photo';

declare var cordova: any;

@Component({
  selector: 'photo-list-item',
  templateUrl: 'photo-list-item.component.html'
})

export class PhotoListItemComponent {
  @Input() photo: Photo;
  @Output() onDelete = new EventEmitter();
  @Output() onToggle = new EventEmitter();


  constructor(private domSanitizer: DomSanitizer) {
  }

  displayImage(base64Image: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(base64Image);
  }

  deletePhoto($event?: Event) {
    $event.stopPropagation();
    this.onDelete.emit();
  }

  toggleStar($event?: Event) {
    $event.stopPropagation();
    this.photo.starred = !this.photo.starred;
    this.onToggle.emit();
  }
}