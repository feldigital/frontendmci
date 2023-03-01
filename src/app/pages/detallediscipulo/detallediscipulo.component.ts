
import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { ModalService } from 'src/app/servicios/modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { MiembroI } from 'src/app/models/miembro.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NuevoI } from 'src/app/models/nuevo.model';
import { NuevoService } from 'src/app/servicios/nuevo.service';


@Component({
  selector: 'app-detallediscipulo',
  templateUrl: './detallediscipulo.component.html',
  styleUrls: ['./detallediscipulo.component.scss']
})
export class DetallediscipuloComponent implements OnInit {

  registro: MiembroI = new MiembroI();
  parametro: any;
  hitorialnuevo: any;
  titulo: string = "Detalle del Discipulo";
  public fotoSeleccionada!: File;
  progreso: number = 0;
  

  constructor(
    private miembroService: MiembroService,
    private modalService:ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private nuevoService: NuevoService
  ) { }

  ngOnInit() {
    this.parametro = this.activatedRoute.snapshot.params.id;
    console.log(this.parametro);
    this.miembroService.getMiembro(this.parametro)
      .subscribe((registro: MiembroI) => {
        this.registro = registro;   
        this.cargarHistorial();    
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
    console.log(this.fotoSeleccionada);
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

  
  eliminarHistorial(historial: NuevoI) {
    this.nuevoService.delete(historial.idGanados).subscribe(json => {
      this.cargarHistorial();
      Swal.fire({
        icon: 'success',
        title: `Ok`,
        text: `El historial de seguimiento al nuevo ${historial.idMiembro.nomCompleto} fue quitado correctamente`,
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
 
  cargarHistorial() {
    this.hitorialnuevo = null;
    this.nuevoService.getHistorialNuevo(this.registro.idMiembro)
      .subscribe((resp: NuevoI) => {
        this.hitorialnuevo = resp;
      },
        (err: any) => { console.error(err) }
      );
  }


  cerrarModal() {  
  }

}

