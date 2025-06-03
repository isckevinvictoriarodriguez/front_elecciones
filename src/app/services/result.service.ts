import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

    // Obtener resultados por curso y examen
    obtenerResultados(curso_id: string, examen_id: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/examenanswers/get-ans/${curso_id}/${examen_id}`);
    }

  // Obtener resultados por ID
  getResultadosById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/examenanswers/get-ans/${_id}`);
  }
  
}
