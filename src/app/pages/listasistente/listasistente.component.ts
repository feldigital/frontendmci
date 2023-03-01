import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { MiembroI } from 'src/app/models/miembro.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-listasistente',
  templateUrl: './listasistente.component.html',
  styleUrls: ['./listasistente.component.scss']
})
export class ListasistenteComponent implements OnInit {


  miembros!: any;  

  constructor(private miembroService: MiembroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
) {
    this.ListarMiembros();

  }


  ngOnInit() {

  }

  ListarMiembros() {
    this.miembroService.getMiembros()
      .subscribe(resp => {
        this.miembros =  resp;
        console.log(resp);
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
          this.miembros = this.miembros.filter((cli: MiembroI) => cli !== miembro);
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
              
              //'<a href="">Why do I have this issue?</a>'
            })
          });

      }
    });
  }
  abrirModal(miembro: MiembroI): void {   
  }
}
