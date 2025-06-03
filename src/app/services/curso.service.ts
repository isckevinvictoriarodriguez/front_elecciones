import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para hacer peticiones HTTP
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para registrar el curso
  registrarCurso(curso: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos`, curso); // Hacemos la petición POST
  }

  //Metodo para obtener cursos con cantidad user and examenes
  obtenerCursosConCantidad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos`);
  }

   // Método para obtener detalles de un curso por su ID
   getCursoDetalles(cursoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cursos/${cursoId}`);
  }


  // Generar respuestas automáticas
  generate(curso_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auto/responder-automatico/curso/${curso_id}`, {});
  }


    
  // Obtener curso por ID
  getCursoById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cursos/get-curso/${_id}`);
  }


  actualizarCurso(_id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cursos/curso-update/${_id}`, user);
  }

  


}
