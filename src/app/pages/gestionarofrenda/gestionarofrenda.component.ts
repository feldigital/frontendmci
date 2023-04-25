import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { $ } from 'protractor';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionarofrenda',
  templateUrl: './gestionarofrenda.component.html',
  styleUrls: ['./gestionarofrenda.component.scss']
})
export class GestionarofrendaComponent implements OnInit {
  listtema: any;
  filterOfrenda: ReporteCelula[] | any;
  _listFilter!: string;

  
 
  
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterOfrenda = this.listFilter ? this.performFilter(this.listFilter) : this.listtema;
  }


  constructor(
    private reportecelulaSevicio: ReporteCelulaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }


  performFilter(filterBy: string): ReporteCelula[] {
    if (filterBy === '' || filterBy.length < 3) return this.listtema
    filterBy = filterBy.toLocaleLowerCase();
    return this.listtema.filter((tema: ReporteCelula) => tema.idCelula.idMiembroLider.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1);
    //|| celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1 || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {
    this.cargarTemas();
  }


  cargarTemas() {
    this.listtema = null;
    this.reportecelulaSevicio.getOfrendaCelula()
      .subscribe((resp: ReporteCelula) => {
        this.listtema = resp;
        this.filterOfrenda = this.listtema;
      },
        (err: any) => { console.error(err) }
      );
  }

  Verificar(itemt: ReporteCelula) {
    if (itemt.verificada === true)
      itemt.verificada = false; else itemt.verificada = true;
    itemt.fecVerificada = new Date();
    this.reportecelulaSevicio.update(itemt).subscribe(resp => {
      Swal.fire({
        icon: 'success',
        title: 'Ok',
        text: `La celula de ${itemt.idCelula.idMiembroLider.nomCompleto} identificada con el ID ${itemt.idCelula.idCelula } ha sido gestionada correctamente!`,
      });
    },
      err => {

      });
  }
}
