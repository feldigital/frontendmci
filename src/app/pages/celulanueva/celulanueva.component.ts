import { Component, OnInit } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { RedI } from 'src/app/models/red.model';
import { CelulaI } from 'src/app/models/celula.model';
import { CelulaService } from 'src/app/servicios/celula.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-celulanueva',
  templateUrl: './celulanueva.component.html',
  styleUrls: ['./celulanueva.component.scss']
})
export class CelulanuevaComponent implements OnInit {
  lider: MiembroI = new MiembroI();
  celula: CelulaI = new CelulaI();
  red!: any;
  celulaForm!: FormGroup;
  lideres: any;
  filterCelulas!: any;
  parametro: any;

  constructor(
    private fb: FormBuilder,
    private miembroService: MiembroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private celulaServicio: CelulaService) {
    this.cargarRed();
    this.cargarMembresia();   
    this.filterCelulas = null;

  }

  ngOnInit(): void {
    this.crearFormulario();
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.miembroService.getMiembro(this.parametro)
      .subscribe((lider: MiembroI) => {
        this.lider = lider;
        this.celulaForm.controls['idMiembroLider'].setValue(this.parametro);
        this.celulaForm.controls['idMiembroLider'].setValue(this.lider.idMiembro);  
        this.buscarCelulasLider();  
      });
      this.celulaForm.controls['gcompleto'].setValue(false);
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  cargarRed() {
    this.red = null;
    this.celulaServicio.getRed()
      .subscribe((resp: RedI) => {
        this.red = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.celulaForm = this.fb.group
      ({
        idCelula: [''],
        idMiembroLider: [''],
        nombreAnfitrion: [''],
        direccion: [''],
        barrio: [''],
        fecApertura: [new Date()],
        diaCelula: [''],
        horaCelula: [''],
        idRed: [''],
        estado: ['Activa'],
        usuario: [''],
        fecUsuario: [new Date()],
        gcompleto: ['false'],
      });
  }


  create() {
    if (this.celulaForm.status == 'VALID') {
      console.log(this.celulaForm.value);
      this.celulaServicio.create(this.celulaForm.value).subscribe(celula => {
        console.log(celula);
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `La celula con anfitrion  ${this.celulaForm.value.nombreAnfitrion} ha sido creado correctamente`,
        });
        this.router.navigate(['/listcelula']);
      },
        err => {
    
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se pudo guardar la celula en la base de datos!',
            footer: err.mensaje //JSON.stringify(err)
          });
        }
      );

    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para crear la celula'
      });
    }
  }


  /*cargarMembresia() {
    this.lideres = null;
    //let liderAct = localStorage.getItem("lidersistema");
    this.miembroService.getMiembrosLideres()
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }*/

  cargarMembresia() {
    this.lideres = null;
    let liderAct = localStorage.getItem("lidersistema");
    this.miembroService.getMiembrosLideres(liderAct)
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

  buscarCelulasLider(){   
    this.filterCelulas = null; 
    this.celulaServicio.getCelulaLider(this.celulaForm.get('idMiembroLider')?.value)
      .subscribe((resp: CelulaI) => {
        this.filterCelulas = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

}
