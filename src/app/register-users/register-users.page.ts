import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importamos los elementos necesarios para el formulario reactivo
import { UserService } from '../services/user.service';
import { NavigationStart, Router } from '@angular/router';
import { IndexDBService } from '../services/index-db.service';
import { UiService } from '../services/ui.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register-users',
  templateUrl: './register-users.page.html',
  styleUrls: ['./register-users.page.scss'],
  standalone: false

})
export class RegisterUsersPage implements OnInit {
  userForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: ['', Validators.required],
    area: ['', Validators.required],
    telefono: ['', Validators.required],
    whatsapp: [''],
    lider: ['', Validators.required],
    responsable: [null],
    movilizador: [null],
    ce: [''],
    seccion: ['', Validators.required],
    sec_calle: [''],
    sec_numero: [''],
    sec_colonia: [''],
    sec_municipio: [''],
    sec_cp: ['', [Validators.pattern('^[0-9]{5}$')]],
    lat: [''],
    long: [''],
    sec_referencia: [''],
    link: [''],
    // rol: [{ value: 'INVITADO', disabled: true }, Validators.required],
    rol: ['', Validators.required],
    estatus: [{ value: 'PENDIENTE', disabled: true }, Validators.required],
    adicional: [true],
    fotos: this.formBuilder.array([])
  });

  mostrarFormularioFlag: boolean = true;

  areasAPI: any[] = [];
  areasSelect: any[] = [];
  responsablesSelect: any[] = [];
  movilizadoresSelect: any[] = [];

  private seccionBusqueda = new Subject<string>();
  seccionNoEncontrada: boolean = false;


  users: any[] = [];  // Variable para almacenar la lista de cursos
  isLoading: boolean = true;  // Estado de carga
  userId: string | null = null; // Propiedad para almacenar el ID del usuario
  filtroBusqueda: string = '';
  usuariosOriginales: any[] = [];
  usuariosFiltrados: any[] = [];  // Para mostrar los usuarios filtrados


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private indexedDbService: IndexDBService,
    private uiService: UiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cerrarFormulario();
      }
    });
  }

  ngOnInit() {
    this.cargarAreas()
    this.seccionBusqueda.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(numero => {
      this.buscarDireccion(numero);
    });
  }
  ngOnDestroy() {
    this.cerrarFormulario();
  }

  mostrarFormulario() {
    if (!this.mostrarFormularioFlag) {
      this.mostrarFormularioFlag = true;
    }
  }
  cerrarFormulario() {
    if (this.mostrarFormularioFlag) {
      this.mostrarFormularioFlag = false;

      this.userForm.reset({
        adicional: true,
        estatus: 'PENDIENTE',
        rol: 'INVITADO'
      });
    }
  }
  toggleFormulario() {
    if (this.mostrarFormularioFlag) {
      this.cerrarFormulario();
    } else {
      this.mostrarFormulario();
    }
  }

  newUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.uiService.toastInfo('Por favor completa todos los campos requeridos');
      return;
    }
    
    const fotoPersona = this.userForm.get('fotos');
    let arrayFotoPersona: any[] = [];
    fotoPersona?.value.forEach((img: any) => {
      let mimeType = this.uiService.obtenerTipoExtension(img.imagen);
      const dataFoto = {
        extension: mimeType,
        imagen: img.imagen.replace(`data:image/${mimeType};base64,`, '')
      }
      arrayFotoPersona.push(dataFoto);
    });

    // Obtenemos una copia del form y transformamos responsable a array
    const raw = this.userForm.getRawValue();
    const formValue = {
      ...raw,
      fotos: arrayFotoPersona,
      responsable: raw.responsable ? [raw.responsable] : [],
      movilizador: raw.movilizador ? [raw.movilizador] : []
    };

    console.log("form to send ->", formValue);

    this.userService.nuevoRegistro(formValue).subscribe(response => {
      this.cerrarFormulario();
      console.log('Usuario actualizado:', response);
      this.uiService.toastInfo('Registro guardado de manera correcta');
    });
  }

  createFoto(foto: any = {}): FormGroup {
    return this.formBuilder.group({
      imagen: [foto.imagen || ''],
      extension: [foto.extension || '']
    });
  }
  addFoto(foto?: any) {
    const newFoto = this.createFoto(foto);
    newFoto.valueChanges.subscribe((changes) => {
      const index = this.foto.controls.indexOf(newFoto);
      this.updateIndexedDBCuerpo(index, changes);
    });
    this.foto.push(newFoto);
  }
  removeFoto(index: number) {
    this.foto.removeAt(index);
  }
  updateIndexedDBCuerpo(index: any, value: any) {
    this.indexedDbService.addPhotoSigna(value.imagen, 'signalitica' + index, value.extension)
  }
  get foto(): FormArray {
    return this.userForm.get('fotos') as FormArray;
  }
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const control = this.foto.at(index).get('imagen');
        if (control) {
          control.setValue(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  cargarAreas() {
    this.userService.getAreas().subscribe({
      next: (data: any[]) => {
        this.areasAPI = data;
        this.areasSelect = data.map(area => area.nombreArea).filter(nombre => !!nombre);
      },
      error: (error) => {
        console.error('Error al cargar las áreas:', error);
      }
    });
  }
  onAreaChange(nombreAreaSeleccionada: string) {
    const area = this.areasAPI.find(a => a.nombreArea === nombreAreaSeleccionada);
    console.log("area -> ", area);

    if (area) {
      console.log("Area -> ", area);

      this.userForm.patchValue({
        lider: area.lider || '',
        responsable: '' // Limpiar selección previa
      });
      this.responsablesSelect = area.responsable || [];
    } else {
      this.userForm.patchValue({ lider: '', responsable: '' });
      this.responsablesSelect = [];
    }
  }
  onResponsableChange(responsableSeleccionado: any) {
    if (!responsableSeleccionado?.ce) {
      this.movilizadoresSelect = [];
      this.userForm.patchValue({ movilizador: '' });
      return;
    }

    const areaSeleccionada = this.areasAPI.find(
      a => a.nombreArea === this.userForm.get('area')?.value
    );

    if (areaSeleccionada && areaSeleccionada.movilizador) {
      // Filtrar movilizadores cuyo ceResp coincida con el ce del responsable seleccionado
      this.movilizadoresSelect = areaSeleccionada.movilizador.filter(
        (m: any) => m.ceResp === responsableSeleccionado.ce
      );
    } else {
      this.movilizadoresSelect = [];
    }

    this.userForm.patchValue({ movilizador: '' }); // Limpiar selección previa
  }
  onNumeroInput() {
    const valor = this.userForm.get('seccion')?.value;
    if (!valor) {
      this.seccionNoEncontrada = false;
      this.limpiarDireccion();
      return;
    }

    this.seccionBusqueda.next(valor);
  }
  buscarDireccion(numero: string) {
    try {
      if (!numero || numero.trim() === '') return;
      this.userService.buscarSeccion(numero).subscribe({
        next: (data) => {
          if (data) {
            let link = ''
            if (data.LAT && data.LONG) {
              link = `https://www.google.com/maps?q=${data.LAT},${data.LONG}`
            }
            this.userForm.patchValue({
              sec_calle: data.CALLE ?? '',
              sec_numero: data.NUMERO ?? '',
              sec_colonia: data.COLONIA ?? '',
              sec_municipio: data.MUNICIPIO ?? '',
              sec_cp: data.CODIGO_POSTAL ?? '',
              lat: data.LAT ?? '',
              long: data.LONG ?? '',
              sec_referencia: data.REFERENCIA ?? '',
              link: link
            });
            this.seccionNoEncontrada = false;
          } else {
            this.limpiarDireccion();
            this.seccionNoEncontrada = true;
          }
        },
        error: (err) => {
          // console.error('Error al buscar dirección:', err);
          this.limpiarDireccion();
          this.seccionNoEncontrada = true;
        }
      });
    } catch (error) {
      console.log("Error");

    }
  }
  limpiarDireccion() {
    this.userForm.patchValue({
      sec_calle: '',
      sec_numero: '',
      sec_colonia: '',
      sec_municipio: '',
      sec_cp: '',
      lat: '',
      long: '',
      sec_referencia: ''
    });
  }
}