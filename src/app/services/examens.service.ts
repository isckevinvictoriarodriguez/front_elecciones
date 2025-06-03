import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExamensService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  //registro nuevo examen
  registrarExamen(examen: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/examens/nuevo-examen`, examen);
  }

 // Obtener todos los exámenes
 obtenerExamenes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/examens`);
}

 // Método para eliminar un examen por ID
 eliminarExamen(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/examens/delete-examen/${id}`);
}

  // Obtener resultados por ID
  getResultadosById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/examens/get-examen/${_id}`);
  }


  
  actualizarExamen(_id: string, examen: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/examens/examen-update/${_id}`, examen);
  }


}