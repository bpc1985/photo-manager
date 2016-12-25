import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Photo } from '../entities/photo';
import moment from 'moment';

@Injectable()
export class CloudPhotoLibraryService {
  private photos$: FirebaseListObservable<Photo[]>;

  constructor(private af: AngularFire) {
    this.photos$ = af.database.list('/photos');
  }
  
  public getPhotos(): FirebaseListObservable<Photo[]> {
    return this.photos$;
  }

  public addPhoto(photo): firebase.Promise<any> {
    photo.created = moment(photo.created).toISOString();
    const list$ = this.af.database.object('/photos');
    return list$.update({
      [photo.id]: photo
    });
  }

  public getPhoto(id: string) {
    return this.af.database.object(`/photos/${id}`);
  }

  public deletePhoto(id: string) {
    return this.af.database.object(`/photos/${id}`).remove();
  }

  public updatePhoto(photo) {
    photo.created = moment(photo.created).toISOString();
    const photo$ = this.af.database.object(`/photos/${photo.id}`);
    return photo$.update({
      title: photo.title,
      description: photo.description,
      created: photo.created,
      starred: photo.starred
    });
  }
}
