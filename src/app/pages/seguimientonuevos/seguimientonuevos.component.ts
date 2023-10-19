import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NuevoI } from 'src/app/models/nuevo.model';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MiembroI } from 'src/app/models/miembro.model';
import Swal from 'sweetalert2';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { PostuladosService } from 'src/app/servicios/postulados.service';


@Component({
  selector: 'app-seguimientonuevos',
  templateUrl: './seguimientonuevos.component.html',
  styleUrls: ['./seguimientonuevos.component.scss']
})
export class SeguimientonuevosComponent implements OnInit {
  nuevos!: any;
  filterNuevos: NuevoI[] | any;
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
    this.filterNuevos = this.listFilter ? this.performFilter(this.listFilter) : this.nuevos;
  }

  constructor(
    private nuevoService: NuevoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consolidaruvidaServicio: ConsolidarUvidaService, 
    private postuladoServicio: PostuladosService,
    private spinner: NgxSpinnerService) {
    //Preguntar si admin o de acuerdo a eso  listar listado de nuevo  
    this.ListarNuevosMinisterio();
    this.spinner.show();
    this.cargarCiclos();
    
    this.postuladoUvida = {};  

  }

  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.nuevos
    filterBy = filterBy.toLocaleLowerCase();
    return this.nuevos.filter((nuevo: any) => nuevo.nombreInvitado.toLocaleLowerCase().indexOf(filterBy) !== -1);
    //|| celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1 || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {
    

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


  ListarNuevosMinisterio() {  
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
      this.nuevoService.getNuevosTodos()
      .subscribe(resp => {
        this.nuevos = resp;
        this.nuevos.sort((a: any, b:any) => b.fechaReunion.localeCompare(a.fechaReunion));
        this.filterNuevos = this.nuevos;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );

    }
    else{
      this.nuevoService.getNuevosMinisterio(liderAct)
      .subscribe(resp => {
        this.nuevos = resp;
        console.log(resp);
        this.filterNuevos = this.nuevos;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );
    }    
  }

  delete(nuevo: NuevoI): void { }

  agregarimg(idMiembro: number): void {
    this.router.navigate(['/detalle', idMiembro]);
  }

  
  postular(miembro: any): void {
    Swal.fire({
      icon: 'question',
      html: `
      <br>
      ¿Confirma postular a <b> ${miembro.nombreInvitado} </b> al ciclo de U. de la vida?
      <br>      
      <select id="selectCiclo" class="form-select"  >
          <option value="-1">Seleccione el encuentro al que lo va a postular</option>
          ${this.generarOpcionesSelect()}         
      </select>                   
      <br>
    `,

      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, postular!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let selectElement = document.getElementById('selectCiclo') as HTMLSelectElement;
        const selectedValue = selectElement.value;
        this.postuladoUvida.idUvida=null;
        if (selectedValue !== '-1') {         
          this.obtonerSelect(selectedValue);      
          this.postuladoUvida.idMiembro = miembro.idMiembro;
          this.postuladoUvida.usuarioIngreso = <string>localStorage.getItem("lidersistema");
          this.postuladoUvida.fechaIngreso = new Date();
          this.postuladoUvida.asistioEncuentro = false;
          this.postuladoUvida.bautizadoEncuentro = false;
                 
          this.postuladoServicio.postular(this.postuladoUvida).subscribe(resp => {
            Swal.fire({
              icon: 'success',
              title: `Ok`,
              text: `Se ingreso el postulad@ ${miembro.nombreInvitado} con éxito, para que asista al proximo ciclo .`,
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

vermas(miembro: any): void{
  Swal.fire({
    icon: 'info',  
      html: `
      <br>
      <b> ${miembro.nombreInvitado} </b>
      <br>      
       ${miembro.reunion}  ${miembro.fechaReunion}      
      <br>
      ${miembro.celular}     
      <br><b> Motivo de la oración  </b>
       <br>${miembro.motivoOracion} 
      <br>
      <br> Invitad@ por: ${miembro.nombroQuienInvita } 
      <br> lider Inmediato: ${miembro.nombreLiderInmediato} 
    `,
      
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
}



}

