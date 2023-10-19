import { Component, OnInit } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { RedI } from 'src/app/models/red.model';
import { CelulaService } from 'src/app/servicios/celula.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consolidaruvida',
  templateUrl: './consolidaruvida.component.html',
  styleUrls: ['./consolidaruvida.component.scss']
})
export class ConsolidaruvidaComponent implements OnInit {

  red!: any;
  uvidaForm!: FormGroup;
  lideres: any;
  keyword = 'nomCompleto';
  idCoordinador:any;
  parametro: any;
  listciclos:any;
  nombrebtn!: string

  constructor(
    private fb: FormBuilder,
    private miembroService: MiembroService,   
    private celulaServicio: CelulaService, 
    private router: Router,
    private consolidaruvidaServicio: ConsolidarUvidaService
    ) 
    {
    this.cargarRed();
    this.cargarMembresia();  
    this.nombrebtn = "Crear";  
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarCiclos();    
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
    this.uvidaForm = this.fb.group
      ({
        idUvida: [''],
        idMiembroCoordinador: ['', [Validators.required]],
        cicloUvida: ['', [Validators.required]],
        citaRemha: [''],
        textoRemha: [''],
        fechaEncuentro: [new Date(), [Validators.required]],       
        idRed: ['', [Validators.required]],
        estado: ['true'],
        usuario: [''],
        fechaCreacion: [new Date()],        

      });
  }


  mostrarDatos(itemt: ConsolidarUvidaI) {
    this.nombrebtn = "Actualizar"
    var fn = new Date(itemt.fechaEncuentro);
    console.log(itemt);
    this.uvidaForm.setValue({
      idUvida: itemt.idUvida,
      idMiembroCoordinador: itemt.idMiembroCoordinador,
      cicloUvida: itemt.cicloUvida,
      citaRemha: itemt.citaRemha,
      textoRemha: itemt.textoRemha,
      fechaEncuentro: fn.toJSON().slice(0, 10),      
      idRed: itemt.idRed,
      estado: itemt.estado,
      usuario: itemt.usuario,
      fechaCreacion: itemt.fechaCreacion,     
    })
    this.uvidaForm.get('idMiembroCoordinador')?.setValue(itemt.idMiembroCoordinador);
  }


  create() {
    this.uvidaForm.value.usuario = localStorage.getItem("lidersistema");   
    console.log(this.uvidaForm.value);
    if (this.uvidaForm.status == 'VALID') {  
      if (this.idCoordinador === undefined) {
        Swal.fire({
          icon: 'warning',
          title: "!Alerta",
          text: 'No hay registro seleccionado de la persona que coordinara el encuentro!'
        });
      }
      else {  
      if (this.nombrebtn == "Crear") {
      this.uvidaForm.value.fechaCreacion= new Date();  
      this.consolidaruvidaServicio.create(this.uvidaForm.value).subscribe(ciclo => {
        this.cargarCiclos();
          Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El ciclo de universidad de la vida  ${this.uvidaForm.value.cicloUvida} ha sido creado correctamente`,
        });
        this.uvidaForm.reset();
       
      },
        err => {    
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se pudo guardar el ciclo de la universidad de la vida en la base de datos!',
            footer: err.mensaje //JSON.stringify(err)
          });
        }
      );
      }
      else{     
        this.consolidaruvidaServicio.update(this.uvidaForm.value).subscribe(ciclo => {
          this.cargarCiclos();
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El ciclo de universidad de la vida  ${this.uvidaForm.value.cicloUvida} ha sido actualizado correctameente`,
          });
          this.uvidaForm.reset();
         
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No se pudo actualizar el ciclo de la universidad de la vida en la base de datos!',
              footer: err.mensaje 
            });
          });
      }
    }

    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para crear el ciclo de la universidad de la vida'
      });
       
    }
   
  }

  cargarCiclos() {
    this.listciclos = null;
    this.consolidaruvidaServicio.getCiclos()
      .subscribe((ciclos: any) => {
        this.listciclos = ciclos;
      
      },
        (err: any) => { console.error(err) }
      );
  }


  eliminarCiclo(itemt: ConsolidarUvidaI) {
    Swal.fire({
      title: 'Desea eliminar?',
      text: `El ciclo  ${itemt.cicloUvida} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.consolidaruvidaServicio.delete(itemt.idUvida).subscribe(resp => {
          this.listciclos = this.listciclos.filter((cli: ConsolidarUvidaI) => cli !== itemt);
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El ciclo ${itemt.cicloUvida} ha sido eliminado correctamente.`,
          });
        },

          err => {
            Swal.fire({
               icon: 'error',
               title: `Error`,
               text: err.mensaje,
             });

          });
      }
    });

  }

  cargarMembresia() {
    this.lideres = null;
    this.miembroService.getMiembros()
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }

  onItemSelected(selectedItem: any) {       
      
  }

  asistencia(cicloUvi: any) {       
    Swal.fire({
      icon: 'question',
      html: `
    <br>
    Seleccione la asistencia que desea calificar del  <b> ${cicloUvi.cicloUvida} </b> 
    <br>      
    <select id="selectCiclo" class="form-select"  >
        <option value="-1">Seleccione el tema que desea agregar la asistencia</option>
        ${this.generarOpcionesSelect()}         
    </select>                   
    <br>
  `,  
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, calificar!'
    }).then((result) => {
      if (result.isConfirmed) {
        let selectElement = document.getElementById('selectCiclo') as HTMLSelectElement;
        const selectedValue = selectElement.value;
        if (selectedValue !== '-1') {
          this.router.navigate(['/asistenciauvida', cicloUvi.idUvida,selectedValue]);          
        
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Revisa...',
            text: `No ha seleccionado la asistencia que desea calificar del ciclo de universidad de la vida, ${cicloUvi.cicloUvida}!`,

          });
        }
      }
    });
  }

  generarOpcionesSelect(): string {
    let options ='';
    let asistencias: string[] = ['t1', 't2', 't3', 't4','asistioEncuentro', 'bautizadoEncuentro','t5','t6', 't7', 't8','graduado'];
    asistencias.forEach((item: string) => {
        options += `<option [ngValue]=${item}>${item}</option>`;
      });
    
    return options;
  }


}

