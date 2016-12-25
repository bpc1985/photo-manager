import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { Photo } from '../entities/photo';

import {
  times
} from 'lodash';

@Injectable()
export class PhotoLibraryService {
  public database: SQLite;

  constructor() {
    this.database = new SQLite();
    this.database.openDatabase({name: 'photos.db', location: 'default'});
  }

  public getPhotos() {
    return this.database.executeSql('SELECT * FROM photos', []).then(data => {
      if(data.rows.length > 0) {
        return times(data.rows.length, idx => {
          const { id, title, description, url, starred, created } = data.rows.item(idx);
          return { id, title, description, url, starred: !!starred, created }
        });
      }
      return [];
    }, error => {
      alert('getPhotos() ERROR: ' + JSON.stringify(error.err));
    });
  }

  public addPhoto(photo: Photo) {
    const { id, title, description, url, created } = photo;
    const sqlString = `INSERT INTO photos (id, title, description, url, starred, created)
                       VALUES ('${id}', '${title}', '${description}', '${url}', 0, '${created}')`;
    return this.database.executeSql(sqlString, [])
      .then((data) => {
        //photo.starred = !!photo.starred;
        return data;
      }, error => {
        alert('addPhoto() ERROR: ' + JSON.stringify(error.err));
      });
  }

  public getPhoto(id: string) {
    return this.database.executeSql('SELECT * FROM photos WHERE id = ${id}', [])
      .then(data => {
        //alert('data: ' + JSON.stringify(data));
        return data;
      }, error => {
        alert('getPhoto() ERROR: ' + JSON.stringify(error.err));
      });
  }

  public deletePhoto(id: string) {
    return this.database.executeSql(`DELETE FROM photos WHERE id = '${id}'`, [])
      .then(data => {
        return data;
      }, error => {
        alert('deletePhoto() ERROR: ' + JSON.stringify(error.err));
      });
  }

  public updatePhoto(photo: Photo) {
    const { id, title, description, url, created } = photo;
    const starred = photo.starred ? 1 : 0;
    return this.database.executeSql(`UPDATE photos
                                     SET title = '${title}',
                                         description = '${description}',
                                         url = '${url}',
                                         starred = ${starred},
                                         created = '${created}'
                                     WHERE id = '${id}'`, [])
      .then(() => {
      }, error => {
        alert('deletePhoto() ERROR: ' + JSON.stringify(error.err));
      });
  }
}