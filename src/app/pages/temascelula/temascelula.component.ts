

import { Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Params } from '@angular/router';
import { CelulaService } from 'src/app/servicios/celula.service';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import { CelulaI } from 'src/app/models/celula.model';
import { ReporteCelula } from 'src/app/models/reportecelula.model';


@Component({
  selector: 'app-temascelula',
  templateUrl: './temascelula.component.html',
  styleUrls: ['./temascelula.component.scss']
})
export class TemascelulaComponent implements OnInit {
  celula: CelulaI = new CelulaI();
  parametro: any;
  listtema: any;
  @Input() idCelula: any;

  constructor(
    private celulaServicio: CelulaService,
    private reportecelulaSevicio: ReporteCelulaService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.celulaServicio.getCelulaId(this.parametro)
      .subscribe((celula: any) => {
        this.celula = celula;

        this.cargarTemas();


      });
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  cargarTemas() {
    this.listtema = null;
    this.reportecelulaSevicio.getTemasIdCelula(this.celula.idCelula)
      .subscribe((tema: ReporteCelula) => {
        this.listtema = tema;
      },
        (err: any) => { console.error(err) }
      );
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

  verAsistente(tem: any) {
    Swal.fire({
      icon: 'info',
      title: `Información`,
      text: `Proximamente podras ver quienes te asistieron......`,
    });

  }


}
