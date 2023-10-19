import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { CelulaService } from 'src/app/servicios/celula.service';
import { CelulaI } from 'src/app/models/celula.model';
//import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-listcelula',
  templateUrl: './listcelula.component.html',
  styleUrls: ['./listcelula.component.scss']
})
export class ListcelulaComponent implements OnInit {
  celulas!: any;
  nombreActual = localStorage.getItem("nombsistema");
  filterCelulas: CelulaI[] | any;
  isLoading: boolean = true;
  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterCelulas = this.listFilter ? this.performFilter(this.listFilter) : this.celulas;
  }

  constructor(
    private celulaService: CelulaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) {

   this.spinner.show();
    this.ListarCelulasMinisterio();

  }

  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.celulas
    filterBy = filterBy.toLocaleLowerCase();
    return this.celulas.filter((celula: any) => celula.nombreLider.toLocaleLowerCase().indexOf(filterBy) !== -1
    || celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1
    || celula.nombreLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit() {
    
  }

  ListarCelulasMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");

    if (liderAct==='1202'){
    this.celulaService.getCelulas()
      .subscribe(resp => {
        this.celulas = resp;   
        this.filterCelulas = this.celulas;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );
    }
else{ 
  this.celulaService.getCelulasMinisterio(liderAct)
  .subscribe(respm => {
    this.celulas = respm;   
    this.filterCelulas = this.celulas;
    this.spinner.hide();
    this.isLoading = false;
  },
    err => { console.error(err) }
  );}

  }



  delete(celula: CelulaI): void { }

  

}
