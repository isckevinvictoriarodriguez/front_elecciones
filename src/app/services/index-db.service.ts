import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexDBService {

  private db!: IDBDatabase;

  constructor() {
    this.openDB();
  }
  
  openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PhotoDB', 1);
      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains('photos')) {
          this.db.createObjectStore('photos', { keyPath: 'id' });
        }
      };
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(); // Resolver la promesa cuando la base de datos esté abierta.
      };
      request.onerror = (event: any) => {
        console.error('Error opening IndexedDB:', event);
        reject(event); // Rechazar la promesa si hay un error.
      };
    });
  }

  addPhotoSigna(imagen: String, id: string, extension: string ) {
    const transaction = this.db.transaction(['photos'], 'readwrite');
    const store = transaction.objectStore('photos');
    const request = store.put({ id, imagen, extension });

    request.onsuccess = () => {
      // console.log('Photo added/updated successfully');
    };

    request.onerror = (event: any) => {
      console.error('Error adding/updating imagen:', event);
    };
  }

  getPhoto(id: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const request = store.get(id);
      request.onsuccess = (event: any) => {
        resolve(event.target.result?.imagen);
      };
      request.onerror = (event: any) => {
        reject(event);
      };
    });
  }
  getAllPhotos(): Promise<{ }[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onerror = (event: any) => {
        reject(event);
      };
    });
  }
  deletePhoto(id: string) {
    const transaction = this.db.transaction(['photos'], 'readwrite');
    const store = transaction.objectStore('photos');
    const request = store.delete(id);
    request.onsuccess = () => {
      // console.log('Photo deleted successfully');
    };
    request.onerror = (event: any) => {
      console.error('Error deleting imagen:', event);
    };
  }
  async deleteDatabase() {
    let valorIndex = await this.getAllPhotos();
    valorIndex.forEach((item: any)=>{
      this.deletePhoto(item.id)
    });
  }
}