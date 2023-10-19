import { isDefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MiembroI } from 'src/app/models/miembro.model';
import { NuevoI } from 'src/app/models/nuevo.model';
import { ReunionI } from 'src/app/models/reunion.model';
import { TipoDocI } from 'src/app/models/tipodoc.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

  registro: any;
  reuniones: any;
  lideres: any;
  miembroNuevo: MiembroI = new MiembroI();
  ganadoNuevo: NuevoI = new NuevoI();
  tipos: any;
  nuevoForm!: FormGroup;
  existe: boolean;
  invitadoPor: MiembroI = new MiembroI();
  keyword = 'nomCompleto';


  constructor(private fb: FormBuilder,
    private miembroService: MiembroService,
    private nuevoService: NuevoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.cargarTipos();
    this.cargarReuniones();
    this.cargarMembresia();
    this.crearFormulario();
    this.registro = null;
    this.existe = false;
    
     


    
  }



  ngOnInit() {
    //this.nuevoForm.get('nuevo')?.disable();

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

  cargarReuniones() {
    this.reuniones = null;
    this.miembroService.getReuniones()
      .subscribe((resp: ReunionI) => {
        this.reuniones = resp;
      },
        (err: any) => { console.error(err) }
      );
  }
  cargarMembresia() {
    this.lideres = null;
    this.miembroService.getMiembros()
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;

      },
        (err: any) => { console.error(err) }
      );
  }

  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.nuevoForm = this.fb.group
      ({
        idMiembro: [''],
        tipoDoc: [''],
        numDocumento: [''],
        nomCompleto: ['', [Validators.required, Validators.minLength(3)]],
        //fecNacimiento: [''],
        sexo: [''],
        direccion: [''],
        barrio: [''],
        //email: [''],
        celular: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        ciudad: [''],
        estadoCivil: [''],
        liderInmediato: [''],
        idReunion: ['', [Validators.required]],
        fechaReunion: ['', [Validators.required]],
        idMiembroQuienInvita: ['', [Validators.required]],
        nuevo: ['true'],
        motivoOracion: [''],
        // disposicion: [''],

      });
        }

  mostrarDatos() {
    //var fn = new Date(this.registro.fecNacimiento);
    this.nuevoForm.patchValue({
      idMiembro: this.registro.idMiembro,
      tipoDoc: this.registro.tipoDoc.tipo,
      numDocumento: this.registro.numDocumento,
      nomCompleto: this.registro.nomCompleto,
      //fecNacimiento: fn.toJSON().slice(0, 10),
      sexo: this.registro.sexo,
      direccion: this.registro.direccion,
      barrio: this.registro.barrio,
      //email: this.registro.email,
      celular: this.registro.celular,
      ciudad: this.registro.ciudad,
      estadoCivil: this.registro.estadoCivil,
      liderInmediato: this.registro.liderInmediato,

    })
  }

  create(): void {
    if (this.nuevoForm.status == 'VALID') {
      this.miembroNuevo.tipoDoc = this.nuevoForm.get('tipoDoc')?.value;
      this.miembroNuevo.numDocumento = this.nuevoForm.get('numDocumento')?.value;
      this.miembroNuevo.nomCompleto = this.nuevoForm.get('nomCompleto')?.value;
      this.miembroNuevo.sexo = this.nuevoForm.get('sexo')?.value;
      this.miembroNuevo.direccion = this.nuevoForm.get('direccion')?.value;
      this.miembroNuevo.barrio = this.nuevoForm.get('barrio')?.value;
      this.miembroNuevo.celular = this.nuevoForm.get('celular')?.value;
      this.miembroNuevo.ciudad = this.nuevoForm.get('ciudad')?.value;
      this.miembroNuevo.estadoCivil = this.nuevoForm.get('estadoCivil')?.value;
      this.miembroNuevo.estado = "Activo";
      this.miembroNuevo.usuarioCrea = <string>localStorage.getItem("lidersistema");
      this.miembroNuevo.fecCreacion = new Date();
      this.miembroNuevo.usuarioMod = <string>localStorage.getItem("lidersistema");
      this.miembroNuevo.fecModificacion = new Date();
    
      this.invitadoPor = this.nuevoForm.get('idMiembroQuienInvita')?.value;   
      let idquiennnvita= this.invitadoPor.idMiembro;
      if (idquiennnvita === undefined) {
        Swal.fire({
          icon: 'warning',
          title: "!Alerta",
          text: 'No hay registro seleccionado de la persona que lo invito!'
        });
      }
      else {

        // "si quien lo invita es un lider ese sera su lider osea idMiembro sino se le asigna el lider inmediato de quien lo invito"
        if (this.invitadoPor.lider) this.miembroNuevo.liderInmediato = this.invitadoPor.idMiembro;
        else this.miembroNuevo.liderInmediato = this.invitadoPor.liderInmediato;
        if (this.existe) {
          this.miembroNuevo.idMiembro = this.registro.idMiembro;
          this.miembroNuevo.imgPerfil = this.registro.imgPerfil;
          this.miembroNuevo.email = this.registro.email;
          this.miembroNuevo.citaBiblica = this.registro.citaBiblica;
          this.miembroNuevo.textoBiblico = this.registro.textoBiblico;
          this.miembroNuevo.bautizado = this.registro.bautizado;
          this.miembroNuevo.fechaBautismo = this.registro.fechaBautismo;
          this.miembroNuevo.lider = this.registro.lider;
          this.miembroNuevo.fechaIngreso = this.registro.fechaIngreso;
          this.miembroNuevo.uvida = this.registro.uvida;
          this.miembroNuevo.fechaUvida = this.registro.fechaUvida;
          this.miembroNuevo.cdestino = this.registro.cdestino;
          this.miembroNuevo.fechaCdestino = this.registro.fechaCdestino;
          this.miembroNuevo.fecNacimiento = this.registro.fecNacimiento;
          this.miembroNuevo.fecCreacion = this.registro.fecCreacion;
          this.miembroNuevo.usuarioCrea = this.registro.usuarioCrea;
          this.miembroService.update(this.miembroNuevo).subscribe((resp: any) => {
              this.llenarNuevo(resp.Miembros.idMiembro);
          }
          );
        }
        else {
           this.miembroService.create(this.miembroNuevo).subscribe((resp: any) => {
               this.llenarNuevo(resp.Miembros.idMiembro);
          }
          );
        }
      }

    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para ingresar el reporte del nuevo'
      });
    }
  }

  cancelar() {
    this.nuevoForm.reset();
  }

  BuscarDocumento(documento: string) {
    this.registro = null;
    this.existe = false;
    this.miembroService.getMiembrosDocumento(documento)
      .subscribe((resp: MiembroI) => {
        this.registro = resp;
        this.registro = this.registro[0];
        Swal.fire({
          text: `El documento ${this.registro.numDocumento} ya esta registrado a nombre de ${this.registro.nomCompleto} en la tabla de nuevos desea agregarlo como rescatado?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, cargar datos!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.nuevoForm.controls['nuevo'].setValue(false);
            this.existe = true;
            this.mostrarDatos();

          }
        })

      },
        (err: any) => { console.error(err) }
      );

  }
  llenarNuevo(id: number) {
    this.ganadoNuevo.idMiembro = id;
    this.ganadoNuevo.nuevo = this.nuevoForm.get('nuevo')?.value;
    this.ganadoNuevo.idReunion = this.nuevoForm.get('idReunion')?.value;
    this.ganadoNuevo.fechaReunion = this.nuevoForm.get('fechaReunion')?.value;
    this.ganadoNuevo.motivoOracion = this.nuevoForm.get('motivoOracion')?.value;
    this.ganadoNuevo.idMiembroQuienInvita = this.invitadoPor.idMiembro;
    this.ganadoNuevo.disposicion = "No gestionado"
    this.ganadoNuevo.usuarioIng = <string>localStorage.getItem("lidersistema");    
    this.nuevoService.create(this.ganadoNuevo).subscribe((nue: any) => {
      Swal.fire({
        icon: 'success',
        title: `Ok`,
        text: `El registro ${this.nuevoForm.value.nomCompleto} ha sido creado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
      this.nuevoForm.controls['motivoOracion'].setValue('');
      this.nuevoForm.controls['tipoDoc'].setValue('');
      this.nuevoForm.controls['numDocumento'].setValue('');
      this.nuevoForm.controls['nomCompleto'].setValue('');
      this.nuevoForm.controls['sexo'].setValue('');
      this.nuevoForm.controls['direccion'].setValue('');
      this.nuevoForm.controls['estadoCivil'].setValue('');
      this.nuevoForm.controls['barrio'].setValue('');
      this.nuevoForm.controls['ciudad'].setValue('');
      this.nuevoForm.controls['celular'].setValue('');
    },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'No se pudo guardar el registro en la base de datos!',
          footer: err.mensaje //JSON.stringify(err)
        });
      });


  }

  get nombreNovalido() {
    return this.nuevoForm.get('nomCompleto')?.invalid && this.nuevoForm.get('nomCompleto')?.touched
  }

}

