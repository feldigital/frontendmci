import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { MiembroI } from 'src/app/models/miembro.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/servicios//modal.service';

@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.scss']
})
export class MinisterioComponent implements OnInit {

  miembros!: any;
  //clienteSeleccionado: MiembroI = new MiembroI;
  edad!: number;
  filterMiembros: MiembroI[] | any;
  nombreActual = sessionStorage.getItem("nombsistema");
  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterMiembros = this.listFilter ? this.performFilter(this.listFilter) : this.miembros;
  }

  constructor(private miembroService: MiembroService,
    public modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
      //Preguntar si admin o de acuerdo a eso  listar listado de miembros  
    this.ListarMiembrosMinisterio();
    this.edad = 1;

  }

  performFilter(filterBy: string): MiembroI[] {
    if (filterBy === '' || filterBy.length < 3) return this.miembros
    filterBy = filterBy.toLocaleLowerCase();
    return this.miembros.filter((miembro: MiembroI) => miembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
    || miembro.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1);
    // || miembro.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }


  ngOnInit() {
    this.modalService.notificarUpload.subscribe(miembro => {
      this.miembros = this.miembros.map((miembroOriginal: { idMiembro: any; imgPerfil: any; }) => {
        if (miembro.idMiembro == miembroOriginal.idMiembro) {
          miembroOriginal.imgPerfil = miembro.imgPerfil;
        }
        return miembroOriginal;
      })
    });
  }

  ListarMiembros() {
    this.miembroService.getMiembros()
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;
      },
        err => { console.error(err) }
      );
  }


  ListarMiembrosMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.miembroService.getMiembrosMinisterio(liderAct)
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;
      },
        err => { console.error(err) }
      );
  }

  delete(miembro: MiembroI): void {
    Swal.fire({
      title: 'Confirma Eliminar?',
      text: `A ${miembro.nomCompleto} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(miembro.idMiembro);
        this.miembroService.delete(miembro.idMiembro).subscribe(resp => {
          this.ListarMiembros();
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `${miembro.nomCompleto} eliminado con éxito.`,
          });
        },
          err => {

            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar ...',
              text: 'No se puede eliminar por que hay registro de asistencia a celula!',
              footer: err.error.mensaje

            })
          });

      }
    });
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

  agregarimg(item: MiembroI): void {
    this.router.navigate(['/detalle', item.idMiembro]);
  }

  pipeCumple(fn: Date){
    var cumple=new Date(fn);
    return cumple.toJSON().slice(0,10)

  }
}
