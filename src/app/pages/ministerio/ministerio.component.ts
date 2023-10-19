import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { MiembroI } from 'src/app/models/miembro.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/servicios//modal.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { PostuladosService } from 'src/app/servicios/postulados.service';



@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.scss']
})
export class MinisterioComponent implements OnInit {

  miembros!: any;
  discipulosPostulados!: any;
  edad!: number;
  filterMiembros: MiembroI[] | any;
  isLoading: boolean = true;
  postuladoUvida: any;
  listciclos: any;

  nombreActual = localStorage.getItem("nombsistema");
  

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
    private consolidaruvidaServicio: ConsolidarUvidaService,
    private postuladoServicio: PostuladosService,
  ) {
    //Preguntar si admin o de acuerdo a eso  listar listado de miembros  
    this.spinner.show();
    this.ListarMiembrosMinisterio();
    this.cargarCiclos();
    this.edad = 1;
    this.postuladoUvida = {};

  }

  performFilter(filterBy: string): MiembroI[] {
    if (filterBy === '' || filterBy.length < 3) return this.miembros
    filterBy = filterBy.toLocaleLowerCase();
    return this.miembros.filter((miembro: any) => miembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
      || miembro.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1
      || miembro.nombreLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
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

  cargarCiclos() {
    this.listciclos = null;
    this.consolidaruvidaServicio.getCiclosActivos()
      .subscribe((ciclos: ConsolidarUvidaI) => {
        this.listciclos = ciclos;

      },
        (err: any) => { console.error(err) }
      );
  }


  ListarMiembrosMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
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
    else{
      this.miembroService.getMiembrosMinisterio(liderAct)
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

  delete(miembro: MiembroI): void {
    Swal.fire({
      title: 'Confirma Eliminar?',
      text: `A ${miembro.nomCompleto} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(miembro.idMiembro);
        this.miembroService.delete(miembro.idMiembro).subscribe(resp => {
          this.ListarMiembrosMinisterio();
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

  pipeCumple(fn: Date) {
    var cumple = new Date(fn);
    return cumple.toJSON().slice(0, 10)

  }

  postular(miembro: MiembroI): void {   
      Swal.fire({
        icon: 'question',
        html: `
      <br>
      ¿Confirma postular a <b> ${miembro.nomCompleto} </b> al ciclo de U. de la vida?
      <br>      
      <select id="selectCiclo" class="form-select"  >
          <option value="-1">Seleccione el encuentro al que lo va a postular</option>
          ${this.generarOpcionesSelect()}         
      </select>                   
      <br> `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, postular!'
      }).then((result) => {
        if (result.isConfirmed) {
          let selectElement = document.getElementById('selectCiclo') as HTMLSelectElement;
          const selectedValue = selectElement.value;
          this.postuladoUvida.idUvida = null;
          if (selectedValue !== '-1') {

            this.obtonerSelect(selectedValue);

            this.postuladoUvida.idMiembro = miembro.idMiembro;
            this.postuladoUvida.usuarioIngreso = <string>localStorage.getItem("lidersistema");
            this.postuladoUvida.fechaIngreso = new Date();
            this.postuladoUvida.asistioEncuentro = false;
            this.postuladoUvida.bautizadoEncuentro = false;
            console.log(this.postuladoUvida);
            //necesito saber si ese discipulo ya fue postulado a ese ciclo para no volverlo hacer
            // if (!this.existePostulado(miembro.idMiembro, this.postuladoUvida.idUvida)) {

            this.postuladoServicio.postular(this.postuladoUvida).subscribe(resp => {
              Swal.fire({
                icon: 'success',
                title: `Ok`,
                text: `Se ingreso el postulado ${miembro.nomCompleto} con éxito, para que asista al proximo ciclo .`,
              });
            },
              err => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: 'No se pudo postular el discipulo a este ciclo de universidad de la vida!',
                  // footer: err.error.Error
                })
              });
          }
          else {
            Swal.fire({
              icon: 'warning',
              title: 'Revisa...',
              text: `No ha seleccionado el ciclo al que desea postular al discipulo!`,
            })
          }
        }
      });

   /* }
    else {
      Swal.fire({
        icon: 'warning',
        title: `Denegado`,
        text: `El discipiulo ${miembro.nomCompleto}  no pudo ser postulado, por que ya esta postulado! `,
        showConfirmButton: false,
        timer: 2000
      });
    }*/
  }


  generarOpcionesSelect(): string {
    let options = '';
    if (this.listciclos == null) {
      Swal.fire({
        icon: 'info',
        title: 'información ...',
        text: 'No hay ciclos activos para postular !',

      });
    }
    else {
      this.listciclos.forEach((item: { idUvida: any; cicloUvida: any; }) => {
        options += `<option [ngValue]=${item.idUvida}>${item.cicloUvida}</option>`;
      });
    }
    return options;
  }

  obtonerSelect(item: string): any {
    let i = 0;

    while (i < this.listciclos.length && this.listciclos[i].cicloUvida !== item) {
      i++;
    }
    if (i < this.listciclos.length) { this.postuladoUvida.idUvida = this.listciclos[i].idUvida; }

  }

  existePostulado(id: number): boolean {
    let existe = false;
    this.postuladoServicio.existePostulado().subscribe(resp => {
      let i = 0;
      this.discipulosPostulados = resp;
      while (i < this.discipulosPostulados.length && this.discipulosPostulados[i].idMiembro === id) {
        i++;
      }
      if (i < this.discipulosPostulados.length) {
        existe = true;
      }

    },
      err => {

        Swal.fire({
          icon: 'error',
          title: 'Error al buscar ...',
          text: 'No se pudo hacer la busqueda de postulados!',
          // footer: err.error.Error

        })
      });

    return existe;
  }


}
