import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { PostuladosService } from 'src/app/servicios/postulados.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asistenciauvida',
  templateUrl: './asistenciauvida.component.html',
  styleUrls: ['./asistenciauvida.component.scss']
})
export class AsistenciauvidaComponent implements OnInit {
  isLoading: boolean = true; 
  parametro: any; 
  cicloAct: any;
  postuladoUvida: any; 
  asistenciaUvidaForm!: FormGroup;
  filterPostulados: [] | any; 
  //selectedCardIndex: number | null = null;
  postuladoActual:any;
  asistencias: string[] = ['t1', 't2', 't3', 't4','asistioEncuentro', 'bautizadoEncuentro','t5','t6', 't7', 't8','graduado'];

  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterPostulados = this.listFilter ? this.performFilter(this.listFilter) : this.postuladoUvida;
  }


  constructor(
    private consolidaruvidaServicio: ConsolidarUvidaService,
    private postuladosServicio: PostuladosService,
    private spinner: NgxSpinnerService,   
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.asistenciaUvidaForm = new FormGroup({});
    this.spinner.show();   

    this.postuladoActual={};
  }


  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.postuladoUvida
    filterBy = filterBy.toLocaleLowerCase();
    return this.postuladoUvida.filter((postu: any) => postu.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
      //|| postu.nomCompletoLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
  }


  ngOnInit(): void {
    this.parametro = this.activatedRoute.snapshot.params.id;  
    this.cargarCiclo();
   this.activatedRoute.params.subscribe(
     (params: Params) => {
       this.parametro = params.parametro;
     }
   );
  }

  cargarCiclo() {  
    this.consolidaruvidaServicio.getCiclo(this.parametro)
      .subscribe((ciclos: any) => { 
       this.cicloAct=ciclos;
        this.postuladoUvida=ciclos.postulados;
        this.postuladoUvida.sort((a: any, b:any) => a.nomCompleto.localeCompare(b.nomCompleto));    
        this.filterPostulados=this.postuladoUvida;         
        this.asistenciaUvidaForm = this.fb.group ({        
          
         });
        this.postuladoUvida.forEach((postulado: any) => {

          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}`, this.fb.control(postulado.idPostulado));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t1`, this.fb.control(postulado.t1));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t2`, this.fb.control(postulado.t2));          
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t3`, this.fb.control(postulado.t3));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t4`, this.fb.control(postulado.t4));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_asistioEncuentro`, this.fb.control(postulado.asistioEncuentro));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_bautizadoEncuentro`, this.fb.control(postulado.bautizadoEncuentro));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t5`, this.fb.control(postulado.t5));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t6`, this.fb.control(postulado.t6));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t7`, this.fb.control(postulado.t7));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t8`, this.fb.control(postulado.t8));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_graduado`, this.fb.control(postulado.graduado));
         
        });

        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );
  }

  cadenaCorta(cadena: String): String{
    return  cadena?.substring(0,100);
  }
 
  actualizarAsistencia(){  
    this.postuladoUvida.forEach((postulado: any) => {
      this.postuladoActual.idPostulado=postulado?.idPostulado;
      this.postuladoActual.t1=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t1`)?.value;
      this.postuladoActual.t2=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t2`)?.value;
      this.postuladoActual.t3=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t3`)?.value;
      this.postuladoActual.t4=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t4`)?.value;
      this.postuladoActual.t5=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t5`)?.value;
      this.postuladoActual.t6=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t6`)?.value;
      this.postuladoActual.t7=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t7`)?.value;
      this.postuladoActual.t8=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t8`)?.value;
      this.postuladoActual.asistioEncuentro=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_asistioEncuentro`)?.value;
      this.postuladoActual.bautizadoEncuentro=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_bautizadoEncuentro`)?.value;
      this.postuladoActual.graduado=this.asistenciaUvidaForm.get(`${postulado.idPostulado}_graduado`)?.value;
      console.log(this.postuladoActual);
      this.postuladosServicio.actualizarPostulados(this.postuladoActual)
      .subscribe((postAct: any) => {   });
    });
    Swal.fire({
      icon: 'success',
      title: `Ok`,
      text: `Asistencia actualizada correctamente`,          
    });

  }

}


