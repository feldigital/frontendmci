import { Component, OnInit } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { TipoDocI } from 'src/app/models/tipodoc.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-miembro',
  templateUrl: './miembro.component.html'
})
export class MiembroComponent implements OnInit {
  registro: any;
  parametro: any;
  tipos!: any;
  lideres: any;
  nuevoForm!: FormGroup;
  nombrebtn!: string
  edad!: number;
 //liderAct: any;
  ministerio12!: any;



  constructor(private fb: FormBuilder,
    private miembroService: MiembroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.cargarTipos();
    this.crearFormulario();
    this.cargarMembresia();
    this.nombrebtn = "Guardar";
  }


  ngOnInit() {
    
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.cargardatos();
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  cargardatos() {
    //if (!this.parametro) {
    //  this.liderAct = sessionStorage.getItem("lidersistema");
    //  this.parametro = this.liderAct;
    //}
    this.miembroService.getMiembro(this.parametro)
      .subscribe((registro: MiembroI) => {
        this.registro = registro;
        this.mostrarDatos();
        this.cargarMinisterio12();
      });
  }

  refrescar(miembro: MiembroI): void {
    this.parametro = miembro.idMiembro;
    this.cargardatos();

  }

  /*cargarMembresia() {
    this.lideres = null;
    this.miembroService.getMiembrosLideres()
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }*/

  cargarMembresia() {
    this.lideres = null;
    let liderAct = sessionStorage.getItem("lidersistema");
    this.miembroService.getMiembrosLideres(liderAct)
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }



  cargarTipos() {
    this.tipos = null;
    this.miembroService.getTipos()
      .subscribe((resp: TipoDocI) => {
        this.tipos = resp;
      },
        (err: any) => { console.error(err) }
      );
  }


  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.nuevoForm = this.fb.group
      ({
        idMiembro: [''],
        tipoDoc: ['', [Validators.required]],
        numDocumento: [''],
        nomCompleto: ['', [Validators.required, Validators.minLength(2)]],
        fecNacimiento: [''],
        sexo: [''],
        direccion: [''],
        barrio: [''],
        email: [''],
        celular: ['', [Validators.required]],
        ciudad: [''],
        estadoCivil: [''],
        bautizado: [false],
        fechaBautismo: [''],
        lider: [false],
        fechaIngreso: [],
        estado: ['Activo'],
        codigoLider: [''],
        liderInmediato: ['', [Validators.required]],
        uvida: [false],
        cdestino: [false],
        imgPerfil: [''],
        fechaUvida: [''],
        fechaCdestino: [''],
        citaBiblica: [''],
        textoBiblico: [''],
        pwd: [''],
      });
  }

  mostrarDatos() {
    this.nombrebtn = "Actualizar"
    var fn = new Date(this.registro.fecNacimiento);
    var fl = new Date(this.registro.fechaIngreso);
    var fb = new Date(this.registro.fechaBautismo);
    var fu = new Date(this.registro.fechaUvida);
    var fc = new Date(this.registro.fechaCdestino);

    this.nuevoForm.setValue({

      idMiembro: this.registro.idMiembro,
      tipoDoc: this.registro.tipoDoc.tipo,
      numDocumento: this.registro.numDocumento,
      nomCompleto: this.registro.nomCompleto,
      fecNacimiento: fn.toJSON().slice(0, 10),
      sexo: this.registro.sexo,
      direccion: this.registro.direccion,
      barrio: this.registro.barrio,
      email: this.registro.email,
      celular: this.registro.celular,
      ciudad: this.registro.ciudad,
      estadoCivil: this.registro.estadoCivil,
      bautizado: this.registro.bautizado,
      fechaBautismo: fb.toJSON().slice(0, 10),
      lider: this.registro.lider,
      fechaIngreso: fl.toJSON().slice(0, 10),
      estado: this.registro.estado,
      codigoLider: this.registro.codigoLider,
      liderInmediato: this.registro.liderInmediato,
      uvida: this.registro.uvida,
      cdestino: this.registro.cdestino,
      imgPerfil: this.registro.imgPerfil,
      fechaUvida: fu.toJSON().slice(0, 10),
      fechaCdestino: fc.toJSON().slice(0, 10),
      citaBiblica: this.registro.citaBiblica,
      textoBiblico: this.registro.textoBiblico,
      pwd: this.registro.pwd,
    })
  }


  create(): void {
    if (this.nuevoForm.status == 'VALID') {
      if (this.nombrebtn == "Crear") {
        this.miembroService.create(this.nuevoForm.value).subscribe(miembro => {
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El miembro ${this.nuevoForm.value.nomCompleto} ha sido creado correctamente`,
          });
          this.router.navigate(['/ministerio']);
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No se pudo guardar el miembro en la base de datos!',
              footer: err.mensaje //JSON.stringify(err)
            });
          }
        );
      } else {

        this.miembroService.update(this.nuevoForm.value).subscribe(json => {
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El miembro ${this.nuevoForm.value.nomCompleto} ha sido actualizado correctameente`,
          });
          this.router.navigate(['/ministerio']);
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No se pudo actualizar el miembro en la base de datos!',
              footer: err.mensaje //JSON.stringify(err)
            });
          });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para ingresar el miembro'
      });
    }
  }
  cancelar() {
    this.nuevoForm.reset();
  }


  BuscarDocumento(documento: string) {
    this.registro = null;
    this.miembroService.getMiembrosDocumento(documento)
      .subscribe((resp: MiembroI) => {
        this.registro = resp;
       // console.log(this.registro[0].nomCompleto);
        this.registro = this.registro[0];
        this.mostrarDatos();
        Swal.fire({
          icon: 'info',
          title: `Información`,
          text: `El documento ya esta registrado a nombre de ${this.registro.nomCompleto}`,
        });
      },
        (err: any) => { console.error(err) }
      );
  }



  /* FUNCIONES DE VALIDACIÓN DEL FORMULARIO */

  get nombreNovalido() {
    return this.nuevoForm.get('nomCompleto')?.invalid && this.nuevoForm.get('nomCompleto')?.touched
  }

  CalcularEdad(miembro: MiembroI): number {
    const convertAge = new Date(miembro.fecNacimiento);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    if (this.edad) {
      return this.edad;
    }
    return 0;
  }

  cargarMinisterio12() {
    this.miembroService.getMinisterio12(this.registro.idMiembro)
      .subscribe(resp => {
        this.ministerio12 = resp;      
      },
        err => { console.error(err) }
      );
  }

}


