import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NuevoI } from 'src/app/models/nuevo.model';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MiembroI } from 'src/app/models/miembro.model';


@Component({
  selector: 'app-seguimientonuevos',
  templateUrl: './seguimientonuevos.component.html',
  styleUrls: ['./seguimientonuevos.component.scss']
})
export class SeguimientonuevosComponent implements OnInit {
  nuevos!: any;
  filterNuevos: NuevoI[] | any;
  isLoading: boolean = true;
  nombreActual = sessionStorage.getItem("nombsistema");
  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterNuevos = this.listFilter ? this.performFilter(this.listFilter) : this.nuevos;
  }

  constructor(
    private nuevoService: NuevoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) {
    //Preguntar si admin o de acuerdo a eso  listar listado de nuevo  
    this.ListarNuevosMinisterio();
    this.spinner.show();

  }

  performFilter(filterBy: string): NuevoI[] {
    if (filterBy === '' || filterBy.length < 3) return this.nuevos
    filterBy = filterBy.toLocaleLowerCase();
    return this.nuevos.filter((nuevo: NuevoI) => nuevo.idMiembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1);
    //|| celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1 || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {
    

  }

  ListarNuevos() {
    this.nuevoService.getNuevosTodos()
      .subscribe(resp => {
        this.nuevos = resp;
        this.filterNuevos = this.nuevos;
      },
        err => { console.error(err) }
      );
  }



  ListarNuevosMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.nuevoService.getNuevosMinisterio(liderAct)
      .subscribe(resp => {
        this.nuevos = resp;
        this.filterNuevos = this.nuevos;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );
  }

  delete(nuevo: NuevoI): void { }

  agregarimg(item: MiembroI): void {
    this.router.navigate(['/detalle', item.idMiembro]);
  }

}

