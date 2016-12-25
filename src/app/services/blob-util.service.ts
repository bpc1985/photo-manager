import { Injectable } from '@angular/core';

@Injectable()
export class BlobUtilService {

  _blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (evt: any) => {
        const base64Image = evt.target.result;
        resolve(base64Image);
      };
      reader.onerror = (e) => reject(e);
      
      reader.readAsDataURL(blob);
    });
  }

  convertToBase64String(imageData) {
    return 'data:image/png;base64,' + imageData;
  }
}
