import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { PhotoTabsPageComponent } from './pages/tabs/photo-tabs-page.component';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage = PhotoTabsPageComponent;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      let db = new SQLite();
      db.openDatabase({
        name: 'photos.db',
        location: 'default'
      }).then(() => {
        db.executeSql(`create table if not exists photos(
          id TEXT PRIMARY KEY,
          title TEXT,
          description TEXT,
          url TEXT,
          starred NUMERIC,
          created TEXT
        )`, [])
        .catch(error => alert('create DB ERROR: ' + JSON.stringify(error)));
      });
    });
  }
}
