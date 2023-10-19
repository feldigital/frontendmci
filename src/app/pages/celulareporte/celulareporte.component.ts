import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CelulaService } from 'src/app/servicios/celula.service';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import { CelulaI } from 'src/app/models/celula.model';
import { MiembroCelula } from 'src/app/models/miembrocelula.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MedioI } from 'src/app/models/medio.model';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { AsistenciaCelula } from 'src/app/models/asistencia.model';
import { AsistenciaCelulaService } from 'src/app/servicios/asistenciacelula.service';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroCelulaService } from 'src/app/servicios/miembrocelula.service';
import { MiembroService } from 'src/app/servicios/miembro.service';




@Component({
  selector: 'app-celulareporte',
  templateUrl: './celulareporte.component.html',
  styleUrls: ['./celulareporte.component.scss']
})
export class CelulareporteComponent implements OnInit {
  celula: CelulaI = new CelulaI();
  parametro: any;
  miembrocelula: MiembroCelula = new MiembroCelula();
  medios!: any;
  discipuloscelula: any;
  discipuloscelulafaltantes: any;
  reportecreado: ReporteCelula = new ReporteCelula();
  reportederegreso: any;
  listtema: any;
  asistente: AsistenciaCelula = new AsistenciaCelula();
  reportecelulaForm!: FormGroup;
  asistenteSelectedArray = [];

  constructor(
    private fb: FormBuilder,
    private celulaServicio: CelulaService,
    private reportecelulaSevicio: ReporteCelulaService,
    private asistenciacelulaSevicio: AsistenciaCelulaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private celulamiembrosServicio: MiembroCelulaService,
    private miembroService: MiembroService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.celulaServicio.getCelulaId(this.parametro)
      .subscribe((celula: any) => {
        this.celula = celula;
        console.log(this.celula);
        this.cargarMedio();
        this.cargarTemas();
        this.cargarDiscipulos();
        this.reportecelulaForm.controls['idCelula'].setValue(this.celula.idCelula);
      });
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  cargarMedio() {
    this.medios = null;
    this.celulaServicio.getMedio()
      .subscribe((resp: MedioI) => {
        this.medios = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

  get asistecheck() {
    return this.reportecelulaForm.controls["asistecheck"] as FormArray;
  }

  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.reportecelulaForm = this.fb.group
      ({
        idRealizacionCelula: [''],
        fechaCelula: ['', Validators.required],
        idCelula: ['', Validators.required],
        citaCelula: ['', Validators.required],
        temaCelula: ['', Validators.required],
        ofrendaCelula: ['0'],
        fecUsuario: [new Date()],
        idMedioCelula: ['', Validators.required],
        nroAsistentes: ['0'],
        asistecheck: new FormArray([]),// this.fb.array([]),
      });
  }

  Agregarasistecheck(): void {
    this.discipuloscelula.forEach(() => this.asistecheck.push(new FormControl(false)));
  }

  cargarDiscipulos() {
    this.discipuloscelula = null;
    this.celulaServicio.getCelulaDiscipulos(this.celula.idCelula)
      .subscribe((disc: MiembroCelula) => {
        this.discipuloscelula = disc;
        this.Agregarasistecheck();
        this.discipulosfaltantes();
      },
        (err: any) => { console.error(err) }
      );
  }

  cargarTemas() {
    this.listtema = null;
    this.reportecelulaSevicio.getTemasIdCelula(this.celula.idCelula)
      .subscribe((tema: any) => {
        this.listtema = tema;
      },
        (err: any) => { console.error(err) }
      );
  }

  reportar() {
    if (this.reportecelulaForm.status == 'VALID') {
      //verificar si esa celula en esa semana ya fue ingresada

      //CREANDO EL REGISTO DE LA CABECERA
      this.reportecreado.idRealizacionCelula = this.reportecelulaForm.get('idRealizacionCelula')?.value;
      this.reportecreado.idCelula = this.reportecelulaForm.get('idCelula')?.value;
      this.reportecreado.citaCelula = this.reportecelulaForm.get('citaCelula')?.value;
      this.reportecreado.ofrendaCelula = this.reportecelulaForm.get('ofrendaCelula')?.value;
      this.reportecreado.fechaCelula = this.reportecelulaForm.get('fechaCelula')?.value;
      this.reportecreado.temaCelula = this.reportecelulaForm.get('temaCelula')?.value;
      this.reportecreado.idMedioCelula = this.reportecelulaForm.get('idMedioCelula')?.value;
      this.reportecreado.usuarioIng = <string>localStorage.getItem("lidersistema");
      this.reportecreado.fecUsuario = new Date();

      let contadorasistente = 0;
      for (let i = 0; i < this.discipuloscelula.length; i++) {
        if (this.reportecelulaForm.get('asistecheck')?.value[i] == true) {
          contadorasistente = contadorasistente + 1;
        }
      }
      this.reportecreado.nroAsistentes = contadorasistente;
      this.reportecelulaSevicio.create(this.reportecreado).subscribe((resp: ReporteCelula) => {
        this.reportederegreso = resp;

        for (let i = 0; i < this.discipuloscelula.length; i++) {

          if (this.reportecelulaForm.get('asistecheck')?.value[i] == true) {
            this.asistente.idDac = NaN;
            this.asistente.idRealizacionCelula = this.reportederegreso.reportecelula.idRealizacionCelula;
            this.asistente.idMiembroDiscipulo = this.discipuloscelula[i].idMiembro.idMiembro;
            this.asistenciacelulaSevicio.create(this.asistente).subscribe(resp => {
            });
          }
        }
        this.router.navigate(['/listcelula']);  
        //this.cargarTemas();
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El reporte de la celula de la semana fue creado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });       
        
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para realizar el reporte de la celula'
      });
    }
  }


  eliminarReporteCelula(itemt: ReporteCelula) {
    Swal.fire({
      title: 'Desea eliminar?',
      text: `El tema de la celula ${itemt.temaCelula} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportecelulaSevicio.delete(itemt.idRealizacionCelula).subscribe(resp => {
          this.listtema = this.listtema.filter((cli: ReporteCelula) => cli !== itemt);
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El tema ${itemt.temaCelula} ha sido eliminado correctamente.`,
          });
        },

          err => {
            Swal.fire({
              icon: 'error',
              title: `Error`,
              text: `Se ha producido un error, al tratar de eliminar el registro de la base de datos`,
            });

          });
      }
    });

  }

  discipulosfaltantes() {
    this.discipuloscelulafaltantes = null;
    this.miembroService.getMinisterio12(this.celula.idMiembroLider)
      .subscribe(resp => {
        this.discipuloscelulafaltantes = resp;        
        this.discipuloscelula.forEach((falta: any) => {
          this.discipuloscelulafaltantes = this.discipuloscelulafaltantes.filter((cli: any) => cli.idMiembro !== falta.idMiembro.idMiembro);
        });     
      },
        err => { console.error(err) }
      );


  }

  agregarDiscipuloCelula(disc: MiembroI) {

    if (!this.existeDiscipulo(disc.idMiembro)) {
      this.miembrocelula.estado = true;
      this.miembrocelula.idCelula = this.celula.idCelula;
      this.miembrocelula.idMiembro = disc.idMiembro;
      this.celulamiembrosServicio.create(this.miembrocelula).subscribe(json => {
        this.discipuloscelulafaltantes = this.discipuloscelulafaltantes.filter((cli: MiembroI) => cli !== disc);
        this.cargarDiscipulos();
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El discipiulo ${disc.nomCompleto} fue agregado correctamente`,
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: `Denegado`,
        text: `El discipiulo ${disc.nomCompleto}  no pudo ser agregado, por que ya existe! `,
        showConfirmButton: false,
        timer: 2000
      });
    }

  }

  existeDiscipulo(id: number): boolean {
    let existe = false;
    this.discipuloscelula.forEach((item: MiembroCelula) => {
      if (id === item.idMiembro) {
        existe = true;
      }
    });
    return existe;
  }

  verAsistente(tem: any) {
    Swal.fire({
      icon: 'info',
      title: `Información`,
      text: `Proximamente podras ver quienes te asistieron......`,
    });

  }


}
