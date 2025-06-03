import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { NavigationStart, Router } from '@angular/router';
import { IndexDBService } from '../services/index-db.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {
  userForm: FormGroup = this.formBuilder.group({
    _id: [''],
    identificador: [''],
    nombre: [''],
    paterno: [''],
    materno: [''],
    area: [''],
    telefono: [''],
    whatsapp: [''],
    lider: [''],
    responsable: [''],
    movilizador: [''],
    ce: [''],
    seccion: [''],
    sec_calle: [''],
    sec_numero: [''],
    sec_colonia: [''],
    sec_municipio: [''],
    sec_cp: [''],
    lat: [''],
    long: [''],
    sec_referencia: [''],
    link: [''],
    rol: [''],
    estatus: [''],
    adicional: [true],
    fotos: this.formBuilder.array([])
  });

  mostrarFormularioFlag: boolean = false;

  users: any[] = [];
  isLoading: boolean = false;
  userId: string | null = null;
  usuariosFiltrados: any[] = [];
  arrayJerarquia: any[] = [];

  isOpenModalTotales = false;
  isOpenModalGerarquias = false;
  isOpenModalGeneral = false;
  isOpenModalFoto = false;
  mostrarBotonAgregarFoto = false;
  usuarioSeleccionado: any = null;

  estatusPersona = {
    estatus: ''
  };
  buscarPersona = {
    nombre: '',
    paterno: '',
    materno: ''
  };
  sinRes = false;
  sinFoto = false;
  sinResJer = false;
  estatusActivo: string = '';
  mostrarFotosFlag: boolean = false;
  // mostrarErrorFotos: boolean = false;

  // Scroll / Paginacion
  showInfiniteScroll: boolean = true;
  pagina = 1;
  cargando = false;
  limitePorPagina = 30; //Este valor se rige en el servidor
  // paginaActual = 1;
  // noHayMas = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private indexedDbService: IndexDBService,
    private uiService: UiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // this.cerrarFormulario();
      }
    });
  }

  ngOnInit() {
    this.userForm.get('estatus')?.disable();
    this.userForm.get('rol')?.disable();
    this.userForm.get('area')?.disable();
    this.userForm.get('lider')?.disable();
    this.userForm.get('responsable')?.disable();
    this.userForm.get('movilizador')?.disable();
    // Escuchar cambios del select "estatus"
    this.userForm.get('estatus')?.valueChanges.subscribe((valor: string) => {
      this.mostrarFotosFlag = valor === 'COMPLETO';
      this.clearFotos();
    });
  }
  ngOnDestroy() {
  }
  ionViewWillEnter() {
    this.limpiarCampos();
  }
  updateUser() {
    this.userForm.markAllAsTouched();
    const estatus = this.userForm.get('estatus')?.value;
    const fotosArray = this.userForm.get('fotos') as FormArray;

    // Validar si hay al menos una foto válida cargada
    const hayFotoCargada = fotosArray.controls.some(control => {
      const imagen = control.get('imagen')?.value;
      return imagen && imagen.trim() !== '';
    });

    if (estatus === 'COMPLETO' && !hayFotoCargada) {
      this.uiService.toastInfo('*Agrega una foto para completar el proceso.');
      return;
    }

    // this.mostrarErrorFotos = false;

    if (this.userForm.invalid) {
      this.uiService.toastInfo('Formulario inválido, rectifica los campos.');
      return;
    }

    const user = this.userForm.value;

    if (estatus === 'COMPLETO') {
      const fotosProcesadas = fotosArray.controls.map(control => {
        const imagen = control.get('imagen')?.value;
        const mimeType = this.uiService.obtenerTipoExtension(imagen);
        return {
          extension: mimeType,
          imagen: imagen.replace(`data:image/${mimeType};base64,`, '')
        };
      });

      const formValue = {
        ...this.userForm.getRawValue(),
        fotos: fotosProcesadas
      };

      this.userService.actualizarEstatus(user._id, formValue).subscribe(response => {
        console.log('Usuario actualizado con foto:', response);
        this.uiService.toastInfo('Foto guardada de manera correcta');
        this.isOpenModalTotales = false;
        this.buscar();
      });

      return;
    }

    // Otros estatus
    this.userService.actualizarEstatus(user._id, user).subscribe(response => {
      console.log('Usuario actualizado sin foto:', response);
      this.uiService.toastInfo('Estatus actualizado de manera correcta');
      this.isOpenModalTotales = false;
      this.buscar();
    });
  }

  updateUserFoto() {
    console.log('BTN update');
    const user = this.userForm.value;
    console.log('user', user);
    console.log('userId', user._id);
    const fotoPersona = this.userForm.get('fotos');
    console.log("fotoPersona", fotoPersona);
    let arrayFotoPersona: any[] = [];
    fotoPersona?.value.forEach((img: any) => {
      let mimeType = this.uiService.obtenerTipoExtension(img.imagen);
      const dataFoto = {
        extension: mimeType,
        imagen: img.imagen.replace(`data:image/${mimeType};base64,`, '')
      }
      arrayFotoPersona.push(dataFoto);
    });
    const formValue = { ...this.userForm.getRawValue(), fotos: arrayFotoPersona };
    console.log("form final", formValue);
    this.userService.actualizarEstatus(user._id, formValue).subscribe(response => {
      console.log('Usuario actualizado:', response);
      this.uiService.toastInfo('Foto guardada de manera correcta');
      this.isOpenModalFoto = false;
    });
  }
  VerInfoUser(usuario: any) {
    // console.log("usuario verInfoUser->", usuario);
    // console.log("fotosValue", usuario.fotos);
    const idFoto = usuario._id;
    this.userService.foto(idFoto).subscribe(
      (data) => {
        // console.log("data", data);
        if (data.length == 0) {
        } else {
          if (data?.fotos && Array.isArray(data.fotos)) {
            this.sinFoto = false;
            this.foto.clear();
            data.fotos.forEach((foto: any) => {
              this.addFoto({
                imagen: foto.imagen,
                extension: foto.extension || 'jpeg'
              });
            });
          } else {
            this.sinFoto = true;
          }
        }
      },
      (error) => {
        this.uiService.toastInfo('Error de conexión');
        console.error('Error al obtener los usuarios:', error);
      }
    );

    this.userForm.patchValue({
      identificador: usuario.identificador,
      nombre: usuario.nombre,
      paterno: usuario.paterno,
      materno: usuario.materno,
      area: usuario.area,
      telefono: usuario.telefono,
      whatsapp: usuario.whatsapp,
      lider: usuario.lider,
      responsable: usuario.responsable,
      movilizador: usuario.movilizador,
      ce: usuario.ce,
      seccion: usuario.seccion,
      sec_calle: usuario.sec_calle,
      sec_numero: usuario.sec_numero,
      sec_colonia: usuario.sec_colonia,
      sec_municipio: usuario.sec_municipio,
      sec_cp: usuario.sec_cp,
      lat: usuario.lat,
      long: usuario.long,
      sec_referencia: usuario.sec_referencia,
      link: usuario.link,
      rol: usuario.rol,
      estatus: usuario.estatus
      // fotos: usuario.fotos
    });
    // console.log(this.userForm.value);
  }
  filtrar(estatus: string) {
    console.log("Estatus -> ", estatus);
    
    console.log("pagina -> ", this.pagina);
    this.usuariosFiltrados = [];
    this.estatusActivo = estatus;
    this.estatusPersona.estatus = estatus;
    this.isLoading = true;
    this.userService.estatus(this.estatusPersona).subscribe(
      (data) => {
        console.log("Mostrando ", this.usuariosFiltrados.length);
        
        console.log("data filtrar -> ", data);
        if (data.total == 0) {
          this.sinRes = true;
          this.isLoading = false;
        } else {
          this.usuariosFiltrados = data.resultados;
        }
      },
      (error) => {
        this.uiService.toastInfo('Error de conexión');
        console.error('Error al obtener los usuarios:', error);
        this.usuariosFiltrados = [];
        this.isLoading = false;
      }
    );
  }
  async cargarMas(event?: any) {
    try {
      console.log("Pagina: ", this.pagina);
      if (this.cargando) return;
      this.cargando = true;

      // CONSULTA
      const body = { estatus: this.estatusActivo, pagina: this.pagina };
      let query = [];
      query.push(await this.userService.estatus(body).toPromise())

      const respuesta = await Promise.all(query)
      // console.log("resp cargar mas -> ", respuesta[0].resultados);
      console.log("carga otros ->", respuesta[0].resultados.length);
        

      this.pagina++;
      this.cargando = false;

      this.usuariosFiltrados = this.usuariosFiltrados.concat(respuesta[0].resultados);
      console.log("total -> ", this.usuariosFiltrados.length);
      

      if (event) {
        event.target.complete();
        if (respuesta[0]?.resultados.length < 30) {
          event.target.disabled = true;
          this.showInfiniteScroll = false;
        }
      }

      if (respuesta[0]?.resultados.length >= 30) {
        this.showInfiniteScroll = true;
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      if (event) {
        event.target.complete();
      }
      this.showInfiniteScroll = false;
      this.uiService.toastInfo('Error en cargar más usuarios');
      this.usuariosFiltrados = [];
      this.isLoading = false;
    }
  }
  buscar() {
    if (!this.buscarPersona.nombre && !this.buscarPersona.paterno && !this.buscarPersona.materno) {
      this.uiService.toastInfo('Por favor ingresa algun dato');
      return;
    }
    this.isLoading = true;
    this.userService.buscarPersona(this.buscarPersona).subscribe(
      (data) => {
        console.log("data buscar", data);
        if (data.length == 0) {
          this.sinRes = true;
          this.isLoading = false;
          this.usuariosFiltrados = [];
        } else {
          this.usuariosFiltrados = data;
          this.isLoading = false;
        }
      },
      (error) => {
        this.uiService.toastInfo('Error de conexión');
        console.error('Error al obtener los usuarios:', error);
        this.usuariosFiltrados = [];
        this.isLoading = false;
      }
    );
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
      // this.mostrarErrorFotos = false;
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

  abrirModalTotales(item: any) {
    this.usuarioSeleccionado = item;
    this.isOpenModalTotales = true;
    this.userForm.patchValue(item);
    this.userForm.get('estatus')?.enable();
  }
  abrirModalGerarquias(item: any) {
    this.isOpenModalGerarquias = true;
    const idJer = item._id;
    this.userService.jerarquia(idJer).subscribe(
      (data) => {
        console.log("query jerarquia ->", data);
        if (data.length == 0) {
          this.sinResJer = true;
        } else {
          this.arrayJerarquia = data;
          this.ordenarJerarquia();
          this.sinResJer = false;
          console.log("jerarquia", this.arrayJerarquia);
        }
      },
      (error) => {
        this.uiService.toastInfo('Error de conexión');
        console.error('Error al obtener la jerarquia:', error);
      }
    );
  }
  abrirModalGeneral() {
    this.isOpenModalGeneral = true;
    this.userForm.get('estatus')?.disable();
    this.mostrarBotonAgregarFoto = false;
    this.foto.clear();
    const fotos = this.userForm.get('fotos')?.value;
    if (fotos && Array.isArray(fotos)) {
      fotos.forEach((foto: any) => this.addFoto(foto));
    }
  }
  abrirModalFoto(item: any) {
    this.mostrarBotonAgregarFoto = true;
    this.usuarioSeleccionado = item;
    this.isOpenModalFoto = true;
    const idFoto = item._id;
    this.userService.foto(idFoto).subscribe(
      (data) => {
        if (data.length == 0) {
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
          const formValue = { ...this.userForm.getRawValue(), fotos: arrayFotoPersona };
          this.userService.actualizarEstatus(item._id, formValue).subscribe(response => {
            this.uiService.toastInfo('Foto guardada de manera correcta');
            this.isOpenModalFoto = false;
          });
        } else {
          if (data?.fotos && Array.isArray(data.fotos)) {
            this.foto.clear();
            data.fotos.forEach((foto: any) => {
              this.addFoto({
                imagen: foto.imagen,
                extension: foto.extension || 'jpeg'
              });
            });
          }
        }
      },
      (error) => {
        this.uiService.toastInfo('Error de conexión');
        console.error('Error al obtener los usuarios:', error);
      }
    );
    // this.userForm.patchValue(item);
  }
  closeModal(tipo: string) {
    if (tipo === 'totales') {
      this.isOpenModalTotales = false;
    } else if (tipo === 'gerarquias') {
      this.isOpenModalGerarquias = false;
    } else if (tipo === 'general') {
      this.isOpenModalGeneral = false;
    } else if (tipo === 'foto') {
      this.isOpenModalFoto = false;
    }
  }
  /* copiarInfo(item: any) {
    const texto = `*${item.nombre} ${item.paterno}*\n\n*CALLE*: ${item.sec_calle} ${item.sec_numero}\n*COLONIA*: ${item.sec_colonia}\n*MUNICIPIO*: ${item.sec_municipio} ${item.sec_cp}\n*REFERENCIA*: ${item.sec_referencia}\n*LINK*: ${item.link}`;

    navigator.clipboard.writeText(texto).then(() => {
      // Aquí podrías abrir WhatsApp Web directamente si se desea:
      // window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);

      // Opcional: Mostrar mensaje de confirmación
      this.uiService.toastInfo('Información copiada al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
      this.uiService.toastInfo('Error al copiar');
    });
  } */
  /* copiarInfo(item: any) {
    const texto = `*${item.nombre} ${item.paterno}*\n\n*CALLE*: ${item.sec_calle} ${item.sec_numero}\n*COLONIA*: ${item.sec_colonia}\n*MUNICIPIO*: ${item.sec_municipio} ${item.sec_cp}\n*REFERENCIA*: ${item.sec_referencia}\n*LINK*: ${item.link}`;

    // Intenta usar la Clipboard API moderna
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        this.uiService.toastInfo('Información copiada al portapapeles');
      }).catch(() => {
        this.uiService.toastInfo('Error al copiar');
      });
    } else {
      // Fallback usando un textarea temporal
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      textarea.style.position = 'fixed'; // evitar scroll
      textarea.style.left = '-9999px'; // ocultarlo
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.uiService.toastInfo('Información copiada al portapapeles');
        } else {
          this.uiService.toastInfo('No se pudo copiar');
        }
      } catch (err) {
        this.uiService.toastInfo('Error al copiar');
      }

      document.body.removeChild(textarea);
    }
  } */
  copiarInfo(item: any) {
    const safe = (value: any): string => value != null && value !== '' ? value : 'SIN DATO';

    const texto = `*${safe(item.nombre)} ${safe(item.paterno)}*\n\n` +
      `*CALLE*: ${safe(item.sec_calle)} ${safe(item.sec_numero)}\n` +
      `*COLONIA*: ${safe(item.sec_colonia)}\n` +
      `*MUNICIPIO*: ${safe(item.sec_municipio)} ${safe(item.sec_cp)}\n` +
      `*REFERENCIA*: ${safe(item.sec_referencia)}\n` +
      `*LINK*: ${safe(item.link)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        this.uiService.toastInfo('Información copiada al portapapeles');
      }).catch(() => {
        this.uiService.toastInfo('Error al copiar');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.uiService.toastInfo('Información copiada al portapapeles');
        } else {
          this.uiService.toastInfo('No se pudo copiar');
        }
      } catch (err) {
        this.uiService.toastInfo('Error al copiar');
      }

      document.body.removeChild(textarea);
    }
  }

  limpiarCampos() {
    this.usuariosFiltrados = [];
    this.buscarPersona = {
      nombre: '',
      paterno: '',
      materno: ''
    }
    this.sinRes = false;
  }
  clearFotos() {
    // this.mostrarErrorFotos = false;
    const fotosArray = this.userForm.get('fotos') as FormArray;
    while (fotosArray.length !== 0) {
      fotosArray.removeAt(0);
    }
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  ordenarJerarquia() {
    this.arrayJerarquia.sort((a, b) => {
      const jerarquiaOrden = ['LIDER', 'RESPONSABLE', 'MOVILIZADOR', 'INVITADO'];
      const estatusOrden = ['PENDIENTE', 'PROCESO', 'COMPLETO'];

      const rolDiff = jerarquiaOrden.indexOf(a.rol) - jerarquiaOrden.indexOf(b.rol);
      if (rolDiff !== 0) return rolDiff;

      // Si tienen el mismo rol, ordenar por estatus
      return estatusOrden.indexOf(a.estatus) - estatusOrden.indexOf(b.estatus);
    });
  }
}

