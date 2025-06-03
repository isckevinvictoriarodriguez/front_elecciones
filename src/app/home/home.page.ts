import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importamos los elementos necesarios para el formulario reactivo
import { CursoService } from '../services/curso.service'; // Asegúrate de tener un servicio para manejar la API del backend
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // Bandera para mostrar el formulario
  // mostrarFormularioFlag: boolean = false;
  // cursos: any[] = [];  // Variable para almacenar la lista de cursos
  // isLoading: boolean = true;  // Estado de carga
  // cursoId: string | null = null; // Propiedad para almacenar el ID del usuario
  // // Formulario reactivo
  // cursoForm: FormGroup = this.formBuilder.group({
  //   title: ['', [Validators.required]], // El título es obligatorio
  //   description: ['', [Validators.required]]// La descripción es obligatoria

  // });

  constructor(private toastCtrl: ToastController, private formBuilder: FormBuilder, private cursoService: CursoService, private navCtrl: NavController) { }
  ngOnInit() {
    // this.cargarCursos();
  }
  // Función para mostrar el formulario
  // mostrarFormulario() {
  //   this.mostrarFormularioFlag = !this.mostrarFormularioFlag;
  //   this.cursoForm.reset();
  //   this.cursoId = null; // Reiniciar el ID para que la próxima vez cree un usuario

  // }
  // // Función para registrar el curso
  // registrarCurso() {
  //   if (this.cursoForm.valid) {
  //     const curso = this.cursoForm.value; // Extraemos los valores del formulario
  //     if (this.cursoId) {
  //       // Si hay un userId, significa que estamos actualizando
  //       this.cursoService.actualizarCurso(this.cursoId, curso).subscribe(response => {
  //         // console.log('Usuario actualizado:', response);
  //         alert(response.mensaje); // Alerta con el mensaje del backend    
  //         // Limpiar el formulario después de actualizar
  //         this.cursoId = null; // Reiniciar userId después de la actualización
  //         this.cargarCursos(); // Refrescar la lista de usuarios después de la actualización
  //       });
  //     } else {
  //       // Si no hay un userId, significa que estamos creando un nuevo usuario
  //       this.cursoService.registrarCurso(curso).subscribe(response => {
  //         // console.log('Usuario registrado:', response);
  //         alert(response.mensaje); // Alerta con el mensaje del backend
  //         // Limpiar el formulario después de registrar
  //         this.cursoForm.reset();
  //         this.cargarCursos(); // Refrescar la lista de usuarios después de la creación
  //       });
  //     }
  //   }
  // }
  // VerInfoCurso(_id: string) {
  //   // this.router.navigate(['/examen-contestado', _id]); // Navega pasando el _id
  //   //  console.log('_id del usuario seleccionado:', _id);
  //   this.cargarCurso(_id);
  //   //  this.mostrarFormulario();
  // }
  // cargarCurso(_id: string) {
  //   console.log("Cargando curso con ID:", _id); // Depuración
  //   this.cursoService.getCursoById(_id).subscribe((curso) => {
  //     if (curso) {
  //       console.log("Curso recibido:", curso); // Depuración
  //       this.cursoId = _id; // Guardar el ID para futuras actualizaciones
  //       this.cursoForm.patchValue({
  //         title: curso.title,
  //         description: curso.description
  //       });
  //     }
  //   });
  // }
  // cargarCursos() {
  //   this.cursoService.obtenerCursosConCantidad().subscribe(
  //     (data) => {
  //       this.cursos = data;
  //       this.isLoading = false;
  //       console.log('Cursos:', this.cursos);
  //     },
  //     (error) => {
  //       console.error('Error al obtener los cursos:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }
  // genexa(curso_id: string) {
  //   if (curso_id) {
  //     this.cursoService.generate(curso_id).subscribe(
  //       async () => {
  //         const toast = await this.toastCtrl.create({
  //           message: 'Respuestas generadas con éxito.',
  //           duration: 2000,
  //           color: 'secondary'
  //         });
  //         toast.present();
  //       }
  //     );
  //   } else {
  //     async () => {
  //       const toast = await this.toastCtrl.create({
  //         message: 'Error al generar respuestas.',
  //         duration: 2000,
  //         color: 'danger'
  //       });
  //       toast.present();
  //     }
  //   }
  // }
}