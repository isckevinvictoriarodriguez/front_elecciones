import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from '../services/result.service';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-examen-contestado',
  templateUrl: './examen-contestado.page.html',
  styleUrls: ['./examen-contestado.page.scss'],
  standalone: false
})
export class ExamenContestadoPage implements OnInit {

  examenId: string | null = null;
  resultados: any[] = [];

  constructor(private route: ActivatedRoute,
    private resultService: ResultService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.examenId = this.route.snapshot.paramMap.get('_id');

    if (this.examenId) {
      this.resultService.getResultadosById(this.examenId).subscribe(
        (data) => {
          console.log('Datos recibidos del backend:', data); // Verifica si las preguntas están ordenadas aquí
          this.resultados = data;
          this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
          console.log('Resultados:', this.resultados);
          
        },
        (error) => {
          console.error('Error al obtener resultados:', error);
        }
      );
    }
  }

}
