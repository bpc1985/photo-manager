import { AngularFireModule } from 'angularfire2';

const firebaseConfig = {
  apiKey: 'AIzaSyDzhrla2R9mh6obGxLSYYqwIRg9dKTp6pA',
  authDomain: 'photo-app-17448.firebaseapp.com',
  databaseURL: 'https://photo-app-17448.firebaseio.com',
  storageBucket: 'photo-app-17448.appspot.com'
};

export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig);
