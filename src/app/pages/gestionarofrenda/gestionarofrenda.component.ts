import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-gestionarofrenda',
  templateUrl: './gestionarofrenda.component.html',
  styleUrls: ['./gestionarofrenda.component.scss']
})
export class GestionarofrendaComponent implements OnInit {
  listtema: any;

  filterOfrenda: ReporteCelula[] | any;
  _listFilter!: string;
  isLoading: boolean = true;
  nombreActual = localStorage.getItem("nombsistema");
  temaCelula: ReporteCelula=new ReporteCelula();




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
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) {
    this.spinner.show();
  }


  performFilter(filterBy: string): ReporteCelula[] {
    if (filterBy === '' || filterBy.length < 3) return this.listtema
    filterBy = filterBy.toLocaleLowerCase();
    return this.listtema.filter((tema: any) => tema.nombreLiderCelula.toLocaleLowerCase().indexOf(filterBy) !== -1)
    // || tema.nombreLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
    // || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {
    this.cargarTemasMinisterio();
  }

  cargarTemasMinisterio() {
    this.listtema = null;
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
    this.reportecelulaSevicio.getTemas()
      .subscribe((resp: any) => {
        this.listtema = resp;
        this.filterOfrenda = this.listtema;
        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );

    }
    else{ this.reportecelulaSevicio.getTemasMinisterio(liderAct)
      .subscribe((resp: any) => {
        this.listtema = resp;
        this.filterOfrenda = this.listtema;
        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );}
  }

  Verificar(itemt: any) {     
    this.reportecelulaSevicio.getReporteIdRealizacion(itemt.idRealizacionCelula).subscribe(temaCelula => {
      if (itemt.verificada === true){
      temaCelula.verificada = false; 
      itemt.verificada = false;
    }else {temaCelula.verificada = true;
      itemt.verificada = true;}
      temaCelula.usuarioVer = <string>localStorage.getItem("lidersistema");
      temaCelula.fecVerificada = new Date();  
      console.log(temaCelula) ;
      this.reportecelulaSevicio.update(temaCelula).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: `La celula de ${itemt.nombreLiderCelula} ha sido verificada correctamente!`,
        });
      },
        err => {
          console.error(err)
        });
    },
      err => {
        console.error(err)
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
