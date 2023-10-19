import { Component, OnInit } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { RedI } from 'src/app/models/red.model';
import { CelulaI } from 'src/app/models/celula.model';
import { MiembroCelula } from 'src/app/models/miembrocelula.model';
import { CelulaService } from 'src/app/servicios/celula.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MiembroCelulaService } from 'src/app/servicios/miembrocelula.service';



@Component({
  selector: 'app-celula',
  templateUrl: './celula.component.html',
  styleUrls: ['./celula.component.scss']
})
export class CelulaComponent implements OnInit {
  celula: CelulaI = new CelulaI();
  miembrocelula: MiembroCelula = new MiembroCelula();
  discipuloscelula: any;
  red!: any;
  celulaForm!: FormGroup;
  miembros!: any;
  edad!: number;
  lideres:any;
  filterMiembros: MiembroI[] | any;
  _listFilter!: string;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterMiembros = this.listFilter ? this.performFilter(this.listFilter) : this.miembros;
  }
  parametro: any;
  parametrolider: any;

  constructor(
    private fb: FormBuilder,
    private miembroService: MiembroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private celulaServicio: CelulaService,
    private celulamiembrosServicio: MiembroCelulaService) {
    this.cargarRed();
    this.crearFormulario();
    this.ListarMiembrosMinisterio();
    this.edad = 1;
  }


  performFilter(filterBy: string): MiembroI[] {
    if (filterBy === '' || filterBy.length < 3) return this.miembros
    filterBy = filterBy.toLocaleLowerCase();
    return this.miembros.filter((miembro: MiembroI) => miembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.celulaServicio.getCelulaId(this.parametro)
      .subscribe((celula: CelulaI) => {
        this.celula = celula;
        this.cargarLideres();        
        this.mostrarDatos();
        this.cargarDiscipulos();
        this.parametrolider=celula.idMiembroLider;
      });

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
  cargarDiscipulos() {
    this.discipuloscelula = null;   
    this.celulaServicio.getCelulaDiscipulos(this.celula.idCelula)
      .subscribe((disc: MiembroCelula) => {
        this.discipuloscelula = disc;      
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
        estado: [''],
        usuario: [<string>localStorage.getItem("lidersistema")],
        fecUsuario: [new Date()],        
        gcompleto: ['false'],
      });
  }


  mostrarDatos() {

    var fecha = new Date(this.celula.fecApertura);

    this.celulaForm.setValue({
      idCelula: this.celula.idCelula,
      idMiembroLider: this.celula.idMiembroLider,
      nombreAnfitrion: this.celula.nombreAnfitrion,
      direccion: this.celula.direccion,
      barrio: this.celula.barrio,
      fecApertura: fecha.toJSON().slice(0, 10),
      diaCelula: this.celula.diaCelula,
      horaCelula: this.celula.horaCelula,
      idRed: this.celula.idRed,
      estado: this.celula.estado,
      usuario: this.celula.usuario,
      fecUsuario: this.celula.fecUsuario,
      gcompleto: this.celula.gcompleto,
    })
  }
  update() {
    if (this.celulaForm.status == 'VALID') {
      this.celulaServicio.update(this.celulaForm.value).subscribe(json => {
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `La celula del lider ${this.celula.idMiembroLider.nomCompleto} ha sido actualizada correctamente`,
        });
        this.router.navigate(['/listcelula']);
      },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se pudo actualizar la celula en la base de datos!',
            footer: err.mensaje //JSON.stringify(err)
          });
        });

    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para ingresar la celula'
      });
    }

  }

  
  ListarMiembrosMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    this.miembroService.getMiembrosMinisterio(liderAct)
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;
      },
        err => { console.error(err) }
      );
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

  eliminarDiscipuloCelula(discelula: MiembroCelula) {   
    this.celulamiembrosServicio.delete(discelula.idCm).subscribe( json=> {      
        this.cargarDiscipulos();       
      Swal.fire({
        icon: 'success',
        title: `Ok`,
        //text: `El discipiulo ${discelula.idMiembro} fue quitado de la celula correctamente`,
        text: `El discipiulo fue quitado de la celula correctamente`,
        showConfirmButton: false,
        timer: 1500
      })      
    });
  }

  agregarDiscipuloCelula(disc: MiembroI) {
  //===disc.liderInmediato
    if(this.celula.idMiembroLider){
    if (!this.existeDiscipulo(disc.idMiembro)) {
      this.miembrocelula.estado = true;
      this.miembrocelula.idCelula = this.celula.idCelula;
      this.miembrocelula.idMiembro = disc.idMiembro;
      this.celulamiembrosServicio.create(this.miembrocelula).subscribe(json => {
      this.cargarDiscipulos();  
        Swal.fire({
          icon: 'success',
          title: `Ok`,
          text: `El discipiulo ${disc.nomCompleto} fue agregado correctamente`,
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: `Denegado`,
        text: `El discipiulo ${disc.nomCompleto}  no pudo ser agregado, por que ya existe! `,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }else{
    Swal.fire({
      icon: 'warning',
      title: "!Alerta",
      text: `${this.celula.idMiembroLider} no es lider inmediato del discipulo  ${disc.nomCompleto} que intenta agregar a esta celula.! `,
      footer: 'Cambiele el lider inmediato y vuelva a intentarlo'
    });
  }
  }

  existeDiscipulo(id: number): boolean {
    let existe = false;
    this.discipuloscelula.forEach((item: MiembroCelula) => {
      if (id === item.idMiembro) {
        existe = true;
      }
    });
    return existe;
  }

 
  cargarLideres() {
    this.lideres = null;
    let liderAct = localStorage.getItem("lidersistema");
    this.miembroService.getMiembrosLideres(liderAct)
      .subscribe((resp: MiembroI) => {
        this.lideres = resp; 
      },
        (err: any) => { console.error(err) }
      );
  }


}
