import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NuevoI } from 'src/app/models/nuevo.model';
import { NuevoService } from 'src/app/servicios/nuevo.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionnuevo',
  templateUrl: './gestionnuevo.component.html',
  styleUrls: ['./gestionnuevo.component.scss']
})
export class GestionnuevoComponent implements OnInit {
  registro: any;
  nuevo: NuevoI = new NuevoI();
  parametro: any;
  gestionNuevoForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private nuevoService: NuevoService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) {
    this.crearFormulario();
  }

  ngOnInit() {

    this.parametro = this.activatedRoute.snapshot.params.id;
    this.nuevoService.getNuevos(this.parametro)
      .subscribe((resp: any) => {
        this.registro = resp;    
        this.mostrarDatos();     
      });
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }


  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.gestionNuevoForm = this.fb.group
      ({
        fonollamada: ['', [Validators.required]],
        usuarioFonollamada: [''],
        fecLlamada: [''],
        fonovisita: [''],
        usuarioFonovisita: [''],
        fecVisita: [''],
        observaciones: [''],
        disposicion: ['No gestionado', [Validators.required]],
      });

  }
  mostrarDatos() {
    this.gestionNuevoForm.patchValue({
      fonollamada: this.registro.fonollamada,
      usuarioFonollamada: this.registro.usuarioFonollamada,
      fecLlamada: this.registro.fecLlamada,
      fonovisita: this.registro.fonovisita,
      usuarioFonovisita: this.registro.usuarioFonovisita,
      fecVisita: this.registro.fecVisita,
      observaciones: this.registro.observaciones,
      disposicion: this.registro.disposicion,
    })
  }


  reportar() {
    if (this.gestionNuevoForm.status == 'VALID') {
      this.nuevo.idGanados = this.registro.idGanados;
      this.nuevo.usuarioIng = this.registro.usuarioIng;
      this.nuevo.nuevo = this.registro.nuevo;
      this.nuevo.fechaReunion = this.registro.fechaReunion;
      this.nuevo.motivoOracion = this.registro.motivoOracion,    
      this.nuevo.fonollamada = this.gestionNuevoForm.get('fonollamada')?.value;
      this.nuevo.usuarioFonollamada = this.gestionNuevoForm.get('usuarioFonollamada')?.value;
      this.nuevo.fecLlamada = this.gestionNuevoForm.get('fecLlamada')?.value;
      this.nuevo.fonovisita = this.gestionNuevoForm.get('fonovisita')?.value;
      this.nuevo.usuarioFonovisita = this.gestionNuevoForm.get('usuarioFonovisita')?.value;
      this.nuevo.fecVisita = this.gestionNuevoForm.get('fecVisita')?.value;
      this.nuevo.observaciones = this.gestionNuevoForm.get('observaciones')?.value;
      this.nuevo.disposicion = this.gestionNuevoForm.get('disposicion')?.value;
      this.nuevo.idMiembro = this.registro.idMiembro;
      this.nuevo.idMiembroQuienInvita = this.registro.idMiembroQuienInvita;
      this.nuevo.idReunion =this.registro.idReunion; 
      this.nuevoService.update(this.nuevo).subscribe(json => {
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El seguimiento a ${this.registro.nombreInvitado} ha sido guardado correctamente!`,
        });
        this.router.navigate(['/seguimiento']);
      },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: `No se pudo realizar el seguimiento a ${this.registro.nombreInvitado}  en la base de datos!`,
            footer: err.mensaje //JSON.stringify(err)
          });
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: `Le faltan datos para ingresar el seguimiento  a nombre de ${this.registro.nombreInvitado}`
      });
    }
  }


}


