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
    console.log(this.parametro);
    this.nuevoService.getNuevos(this.parametro)
      .subscribe((resp: NuevoI) => {
        this.nuevo = resp;
        this.mostrarDatos();
        //this.gestionNuevoForm.controls['idMiembro'].setValue(this.nuevo.idMiembro);
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
      fonollamada: this.nuevo.fonollamada,     
      usuarioFonollamada: this.nuevo.usuarioFonollamada,
      fecLlamada: this.nuevo.fecLlamada,
      fonovisita: this.nuevo.fonovisita,
      usuarioFonovisita: this.nuevo.usuarioFonovisita,
      fecVisita: this.nuevo.fecVisita,
      observaciones: this.nuevo.observaciones,
      disposicion: this.nuevo.disposicion,
    })
  }

  reportar() {
    if (this.gestionNuevoForm.status == 'VALID') {

      this.nuevo.fonollamada = this.gestionNuevoForm.get('fonollamada')?.value;
      this.nuevo.usuarioFonollamada = this.gestionNuevoForm.get('usuarioFonollamada')?.value;
      this.nuevo.fecLlamada = this.gestionNuevoForm.get('fecLlamada')?.value;
      this.nuevo.fonovisita = this.gestionNuevoForm.get('fonovisita')?.value;
      this.nuevo.usuarioFonovisita = this.gestionNuevoForm.get('usuarioFonovisita')?.value;
      this.nuevo.fecVisita = this.gestionNuevoForm.get('fecVisita')?.value;
      this.nuevo.observaciones = this.gestionNuevoForm.get('observaciones')?.value;
      this.nuevo.disposicion = this.gestionNuevoForm.get('disposicion')?.value;

      this.nuevoService.update(this.nuevo).subscribe(json => {
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El seguimiento al nuevo ${this.nuevo.idMiembro.nomCompleto} ha sido creado correctamente`,
        });
        this.router.navigate(['/seguimiento']);
      },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se pudo realizar el seguimiento del nuevo en la base de datos!',
            footer: err.mensaje //JSON.stringify(err)
          });
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: `Le faltan datos para ingresar el seguimiento del registro a nombre de ${this.nuevo.idMiembro.nomCompleto}`
      });
    }
  }


}


