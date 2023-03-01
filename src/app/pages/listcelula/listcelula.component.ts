import { Component, OnInit, Pipe } from '@angular/core';
import { CelulaService } from 'src/app/servicios/celula.service';
import { CelulaI } from 'src/app/models/celula.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listcelula',
  templateUrl: './listcelula.component.html',
  styleUrls: ['./listcelula.component.scss']
})
export class ListcelulaComponent implements OnInit {
  celulas!: any;
  nombreActual = sessionStorage.getItem("nombsistema");
  filterCelulas: CelulaI[] | any;
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
    private activatedRoute: ActivatedRoute) {
   //Preguntar si admin o de acuerdo a eso  listar listado de celulas  
    this.ListarCelulasMinisterio();

  }

  performFilter(filterBy: string): CelulaI[] {
    if (filterBy === '' || filterBy.length < 3) return this.celulas
    filterBy = filterBy.toLocaleLowerCase();
    return this.celulas.filter((celula: CelulaI) => celula.idMiembroLider.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
    || celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1);
    // || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {

  }

  ListarCelulas() {
    this.celulaService.getCelulas()
      .subscribe(resp => {
        this.celulas = resp;
        this.filterCelulas = this.celulas;
      },
        err => { console.error(err) }
      );
  }

  ListarCelulasMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.celulaService.getCelulasMinisterio(liderAct)
      .subscribe(resp => {
        this.celulas = resp;
        this.filterCelulas = this.celulas;
      },
        err => { console.error(err) }
      );
  }



  delete(celula: CelulaI): void { }


}
