import { Component, OnInit } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { TipoDocI } from 'src/app/models/tipodoc.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CelulaService } from 'src/app/servicios/celula.service';
import { CelulaI } from 'src/app/models/celula.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  registro: any;
  parametro: any;
  tipos!: any;
  lideres: any;
  nuevoForm!: FormGroup;
  nombrebtn!: string
  edad!: number;
  filterCelulas!: any;
  ministerio12!: any;
  keyword = 'nomCompleto';  


  constructor(private fb: FormBuilder,
    private miembroService: MiembroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private celulaServicio: CelulaService
  ) {

    this.cargarTipos();
    this.crearFormulario();
    this.cargarMembresia();
    this.nombrebtn = "Crear";
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
    this.miembroService.getMiembro(this.parametro)
      .subscribe((resp: MiembroI) => {
        this.registro = resp;        
        this.mostrarDatos();
        this.cargarMinisterio12();
        this.cargarMisCelulas();
      });
  }

  refrescar(miembro: MiembroI): void {
    this.parametro = miembro.idMiembro;
    this.cargardatos();

  }

  cargarMembresia() {
    this.lideres = null;
    let liderAct = localStorage.getItem("lidersistema");
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
        email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
        celular: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
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
        usuarioCrea: [localStorage.getItem("lidersistema")],
        fecCreacion: [new Date()],
        usuarioMod: [localStorage.getItem("lidersistema")],
        fecModificacion: [new Date()],
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
      tipoDoc: this.registro.tipoDoc,
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
      codigoLider: '',
      liderInmediato: this.registro.liderInmediato,
      uvida: this.registro.uvida,
      cdestino: this.registro.cdestino,
      imgPerfil: this.registro.imgPerfil,
      fechaUvida: fu.toJSON().slice(0, 10),
      fechaCdestino: fc.toJSON().slice(0, 10),
      citaBiblica: this.registro.citaBiblica,
      textoBiblico: this.registro.textoBiblico,
      pwd: this.registro.pwd,
      usuarioCrea: this.registro.usuarioCrea,
      fecCreacion: this.registro.fecCreacion,
      usuarioMod: this.registro.usuarioMod,
      fecModificacion: this.registro.fecModificacion,
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

        this.nuevoForm.value.usuarioMod = localStorage.getItem("lidersistema");
        this.nuevoForm.value.fecModificacion= new Date();  
        this.miembroService.create(this.nuevoForm.value).subscribe(json => {
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


  
  cargarMisCelulas(){   
    this.filterCelulas = null; 
    this.celulaServicio.getCelulaLider(this.registro.idMiembro)
      .subscribe((resp: CelulaI) => {
        this.filterCelulas = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

}



