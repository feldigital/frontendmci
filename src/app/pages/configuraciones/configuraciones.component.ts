import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { ModalService } from 'src/app/servicios/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss']
})
export class ConfiguracionesComponent implements OnInit { registro: MiembroI = new MiembroI();
  parametro: any; 
  public fotoSeleccionada!: File;
  progreso: number = 0;
  

  constructor(
    private miembroService: MiembroService,
    private modalService:ModalService,
    private activatedRoute: ActivatedRoute
  ) { }
  
  ngOnInit() {
    let parametro = localStorage.getItem("lidersistema");
    this.miembroService.getMiembro(parametro)
      .subscribe((resp: any) => {
        this.registro = resp;     
      });

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El archivo debe ser del tipo imagen'
      });
      this.fotoSeleccionada != null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire({
        icon: 'error',
        title: 'Error Upload...',
        text: 'Debe seleccionar un archivo de imagen'
      });

    } else {
      this.miembroService.subirFoto(this.fotoSeleccionada, this.registro.idMiembro)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round(((event.loaded || 1) / (event.total || 1)) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.registro = response.miembro as MiembroI;

            this.modalService.notificarUpload.emit(this.registro);
            Swal.fire({
              icon: 'success',
              title: `Ok`,
              text: `La foto de ${this.registro.nomCompleto} se ha subido correctamente!`
            });
          }
        });
    }
  }

 

}

