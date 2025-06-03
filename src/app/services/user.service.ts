import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para hacer peticiones HTTP
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/personas`);
  }
  nuevoRegistro(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/personas`, user);
  }
  actualizarEstatus(_id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/personas/persona-update/${_id}`, user);
  }
  buscarPersona(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/personas/buscar`, body);
  }
  estatus(estatus: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/personas/por-estatus`, estatus);
  }
  foto(_id: any): Observable<any> {
    const body = {
      "_id": _id
    }
    return this.http.post(`${this.apiUrl}/personas/imagenes`, body);
  }
  jerarquia(_id: any): Observable<any> {
    const body = {
      "_id": _id
    }
    return this.http.post(`${this.apiUrl}/personas/persona-jerarquia`, body);
  }
  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/areas`);
  }
  buscarSeccion(numero: string): Observable<any> {
    const body = {
      "seccion": numero
    }
    return this.http.post(`${this.apiUrl}/casillas/buscar-seccion`, body);
  }
}