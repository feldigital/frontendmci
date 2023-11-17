import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { MiembroI } from 'src/app/models/miembro.model';

import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/servicios//modal.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {

  miembros!: any;
  filterMiembros: MiembroI[] | any;
  isLoading: boolean = true;  


  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterMiembros = this.listFilter ? this.performFilter(this.listFilter) : this.miembros;
  }

  constructor(private miembroService: MiembroService,
    // private fb: FormBuilder,
    public modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  
  ) {
    //Preguntar si admin o de acuerdo a eso  listar listado de miembros  
    this.spinner.show();
    this.ListarMiembrosMinisterio(); 
  }

  performFilter(filterBy: string): MiembroI[] {
    if (filterBy === '' || filterBy.length < 3) return this.miembros
    filterBy = filterBy.toLocaleLowerCase();
    return this.miembros.filter((miembro: any) => miembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1     
    );
  }


  ngOnInit() {    
  }

  ListarMiembrosMinisterio() {  
      this.miembroService.getMiembros()
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;     
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );    
  } 

}
