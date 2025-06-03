import { Component, OnInit } from '@angular/core';
import { ExamensService } from '../services/examens.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-examens',
  templateUrl: './list-examens.page.html',
  styleUrls: ['./list-examens.page.scss'],
  standalone: false
})
export class ListExamensPage implements OnInit {

  examens: any[] = []; // Variable para almacenar los cursos
  isLoading: boolean = true;  // Estado de carga
  
filtroBusqueda: string = '';
examensOrigin: any[] = [];


  constructor(private examenService: ExamensService, private router: Router) { }

  ngOnInit() {
    this.cargarExamenes();
  }


  // cargarExamenes() {
  //   this.examenService.obtenerExamenes().subscribe(
  //     (data) => {
  //       this.examens = data;
  //       this.isLoading = false;
  //       console.log('Examenes:', this.examens);
  //     },
  //     (error) => {
  //       console.error('Error al obtener los Examenes:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  cargarExamenes() {
  this.examenService.obtenerExamenes().subscribe(
    (data) => {
      this.examens = data;
      this.examensOrigin = data; // Guardar copia sin filtrar
      this.isLoading = false;
    },
    (error) => {
      console.error('Error al obtener los Examenes:', error);
      this.isLoading = false;
    }
  );
}


filtrarExamenes() {
  const texto = this.filtroBusqueda.toLowerCase().trim();

  if (!texto) {
    this.examens = [...this.examensOrigin];
    return;
  }

  this.examens = this.examensOrigin.filter(examen =>
    examen.title?.toLowerCase().includes(texto) ||
    examen.description?.toLowerCase().includes(texto)
  );
}

  
  eliminarExamen(id: string): void {
    // this.isLoading = true;  // Puedes mostrar un indicador de carga si lo deseas

    console.log("Este es el id"+id);
    
  
    this.examenService.eliminarExamen(id).subscribe({
      next: (response) => {
        alert(response.message);  // Muestra el mensaje de éxito del backend
        this.cargarExamenes();  // Refresca la lista de exámenes
        this.isLoading = false;  // Detén el indicador de carga
      },
      error: (err) => {
        console.error('Error al eliminar el examen:', err);
        this.isLoading = false;  // Detén el indicador de carga
      }
    });
  }

  verDetalles(_id: string) {
    this.router.navigate(['/examenes', _id]); // Navega pasando el _id¿
   console.log('_id del examen seleccionado:', _id);
   
  }




}
