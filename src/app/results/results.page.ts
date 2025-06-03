import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResultService } from '../services/result.service';
import { CursoService } from '../services/curso.service';
import { ExamensService } from '../services/examens.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: false
})
export class ResultsPage implements OnInit { 

  cursos: any[] = [];
  examenes: any[] = [];
  respuestas: any[] = [];
  cursoSeleccionado: string = '';
  examenSeleccionado: string = '';

  _id = '';

  constructor(private router: Router, private http: HttpClient, private resultsService: ResultService, private cursoService: CursoService, private examensService: ExamensService,   private navCtrl: NavController) {}

  ngOnInit() {
    this.obtenerCursos();
    this.obtenerExams();
  }

  obtenerCursos() {
    this.cursoService.obtenerCursosConCantidad().subscribe((cursos) => {
      this.cursos = cursos;
      console.log("lista de cursos-->", this.cursos);
    });
  }

  obtenerExams() {
    this.examensService.obtenerExamenes().subscribe((examenes) => {
      this.examenes = examenes;
      console.log("lista de examenes-->", this.examenes);
    });
  }

  onExamChange(event: any) {
    console.log('CursoID seleccionado:', event.detail.value);
    this.examenSeleccionado = event.detail.value;
  }

  onCursoChange(event: any) {
    console.log('ExamenID seleccionado:', event.detail.value);
    this.cursoSeleccionado = event.detail.value;
  }

  obtenerResultados() {
    if (!this.cursoSeleccionado || !this.examenSeleccionado) {
      console.error('Selecciona un curso y un examen');
      return;
    }

    this.resultsService.obtenerResultados(this.cursoSeleccionado, this.examenSeleccionado)
      .subscribe((res) => {
        this.respuestas = res;
              console.log("estos son los resultados: ", this.respuestas);

      }, (error) => {
        console.error('Error al obtener resultados', error);
      });
  }

  verDetalles(_id: string) {
    this.router.navigate(['/examen-contestado', _id]); // Navega pasando el _id¿
   console.log('_id del examen seleccionado:', _id);
   
  }



 
}
