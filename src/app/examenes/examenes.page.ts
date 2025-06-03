import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; // Importamos los elementos necesarios para el formulario reactivo
import { ExamensService } from '../services/examens.service';
import { CursoService } from '../services/curso.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';  // Importa Router





@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: false
})
export class ExamenesPage implements OnInit {

  cursos: any[] = []; // Variable para almacenar los cursos
  examenId: string | null = null;
  resultados: any[] = [];
  editando: boolean = false; // Inicialmente en modo "Crear Examen"



  // Formulario reactivo
  exaForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]], // El título es obligatorio
    description: ['', [Validators.required]],// La descripción es obligatoria
    curso_id: [[], Validators.required], // Se define como array para manejar múltiples IDs
    // totalScore: ['', [Validators.required]],
    questions: this.formBuilder.array([])

  });

  constructor(private router: Router,private cdr: ChangeDetectorRef, private route: ActivatedRoute, private formBuilder: FormBuilder, private examensService: ExamensService, private cursoService: CursoService) { }

  ngOnInit() {
    this.cargarCursos();

    // Obtener el ID del examen desde la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('_id');
      if (id) {
        this.examenId = id;
        this.cargarExamen(id); // Cargar los datos del examen si hay un ID
        this.editando = true; // 🟢 Cambia a modo edición
      }
      else {
        this.editando = false; // 🔴 Modo creación
      }
    });

  }


  get questions() {
    return this.exaForm.get('questions') as FormArray;
  }

  getOptions(i: number) {
    return (this.exaForm.get('questions') as FormArray).at(i).get('options') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.formBuilder.group({
      question: ['', Validators.required],
      options: this.formBuilder.array([this.formBuilder.group({ option: [''] })]),  // Definir la primera opción
      correctAnswer: ['', Validators.required]
    });

    this.questions.push(questionGroup);
  }

  addOption(i: number) {
    const options = this.getOptions(i);
    options.push(this.formBuilder.group({ option: [''] }));
  }

  //remove Question
  removeQuestion(i: number) {
    const control = this.exaForm.get('questions') as FormArray;
    control.removeAt(i);
  }

  //remove Option
  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex); // Obtener las opciones de la pregunta específica
    options.removeAt(optionIndex); // Eliminar la opción por índice
  }


  //carga de cursos para listar
  cargarCursos() {
    this.cursoService.obtenerCursosConCantidad().subscribe(data => {
      this.cursos = data; // Almacena los cursos obtenidos del backend
    });
  }

  // Función para registrar el examen
  registrarExamen() {
    if (this.exaForm.valid) {
      const examen = this.exaForm.value; // Extraemos los valores del formulario
      examen.questions.forEach((question: any) => {
        question.options = question.options.map((opt: any) => opt.option); // Esto convierte las opciones de objetos a simples strings
      });

      console.log('Datos a enviar al backend:', examen); // Revisar que curso_id tenga IDs

      const questionsArray = this.exaForm.get('questions') as FormArray;
      while (questionsArray.length !== 0) {
        questionsArray.removeAt(0); // Eliminar cada pregunta una por una
      }


      if (this.examenId) {
        // Modo edición
        this.examensService.actualizarExamen(this.examenId, examen).subscribe(response => {
          console.log('Examen actualizado:', response);
          alert('Examen actualizado correctamente');
          // Resetear o actualizar el formulario después de la actualización
          this.exaForm.reset();  // Esto limpiará todos los campos del formulario
          this.examenId = null;  // Opcional: Resetear el ID del examen
          this.editando = false;  // Cambiar el estado a 'Crear Examen'

          // Redirigir a la página de listado de exámenes y borrar el historial
          this.router.navigateByUrl('/list-examens', { replaceUrl: true });
          // Si es necesario, recargar los datos del examen actualizado
          // this.cargarExamen(this.examenId); // Cargar el examen actualizado si es necesario

        });
      } else {
        // Modo creación
        this.examensService.registrarExamen(examen).subscribe(response => {
          console.log('Examen registrado:', response);
          alert('Examen registrado correctamente');
          this.exaForm.reset();
        });
      }





      // // Llamamos al servicio para registrar el curso 
      // this.examensService.registrarExamen(examen).subscribe(response => {

      //   console.log('Examen registrado:', response);
      //   alert(response.mensaje); // Alerta con el mensaje del backend

      //   // Limpiar el formulario después de registrar
      //   this.exaForm.reset();
      //   // this.mostrarFormularioFlag = false; // Ocultar el formulario después de registrarlo
      //   // this.cargarCursos(); // Refrescar la lista de cursos al cerrar el modal
      // });
    }
  }



  cargarExamen(_id: string) {
    this.examensService.getResultadosById(_id).subscribe(data => {
      console.log('Datos recibidos del backend:', data); // Verificar que los datos llegan correctamente

      // Rellenar los datos del formulario
      this.exaForm.patchValue({
        title: data.title,
        description: data.description,
        curso_id: data.curso_id
      });

      // Limpiar las preguntas antes de agregar nuevas
      this.questions.clear();

      // Cargar preguntas y opciones
      data.questions.forEach((q: any) => {
        const questionGroup = this.formBuilder.group({
          question: [q.question, Validators.required],
          options: this.formBuilder.array(q.options.map((opt: any) =>
            this.formBuilder.group({ option: [opt, Validators.required] })
          )),
          correctAnswer: [q.correctAnswer, Validators.required]
        });

        this.questions.push(questionGroup);
      });

      console.log('Formulario después de cargar:', this.exaForm.value);
    });
  }


  setCorrectAnswer(event: any, questionIndex: number) {
    const selectedValue = event.detail.value; // Obtiene el valor del radio seleccionado
    // Aseguramos que el valor se asigna a la respuesta correcta de la pregunta
    this.exaForm.get(`questions.${questionIndex}.correctAnswer`)?.setValue(selectedValue);
  }
  
  getCorrectAnswer(questionIndex: number) {
    const correctAnswer = this.exaForm.get(`questions.${questionIndex}.correctAnswer`)?.value;
  
    // Si el valor de correctAnswer no es válido, devolvemos undefined
    return correctAnswer ? correctAnswer : undefined;
  }

}

