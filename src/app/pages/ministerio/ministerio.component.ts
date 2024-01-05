import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { MiembroI } from 'src/app/models/miembro.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/servicios//modal.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { PostuladosService } from 'src/app/servicios/postulados.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.scss']
})
export class MinisterioComponent implements OnInit {

  miembros!: any;
  discipulosPostulados!: any;
  edad!: number;
  filterMiembros: MiembroI[] | any;
  isLoading: boolean = true;
  postuladoUvida: any;
  listciclos: any;
  fechaActual!: Date;
  fechaCiclo!:Date;

  nombreActual = localStorage.getItem("nombsistema");
  urlrecurso = environment.urlRecursos;
  

  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterMiembros = this.listFilter ? this.performFilter(this.listFilter) : this.miembros;
  }

  constructor(private miembroService: MiembroService,
    // private fb: FormBuilder,
    public modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private consolidaruvidaServicio: ConsolidarUvidaService,
    private postuladoServicio: PostuladosService,
  ) {
    //Preguntar si admin o de acuerdo a eso  listar listado de miembros  
    this.spinner.show();
    this.ListarMiembrosMinisterio();
    this.cargarCiclos();
    this.edad = 1;
    this.postuladoUvida = {};
    this.fechaActual = new Date() ;

  }

  performFilter(filterBy: string): MiembroI[] {
    if (filterBy === '' || filterBy.length < 3) return this.miembros
    filterBy = filterBy.toLocaleLowerCase();
    return this.miembros.filter((miembro: any) => miembro.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
      || miembro.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1
      || miembro.nombreLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }


  ngOnInit() {
    this.modalService.notificarUpload.subscribe(miembro => {
      this.miembros = this.miembros.map((miembroOriginal: { idMiembro: any; imgPerfil: any; }) => {
        if (miembro.idMiembro == miembroOriginal.idMiembro) {
          miembroOriginal.imgPerfil = miembro.imgPerfil;
        }
        return miembroOriginal;
      })
    });
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


  ListarMiembrosMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
      this.miembroService.getMiembros()
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;     
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );

    }
    else{
      this.miembroService.getMiembrosMinisterio(liderAct)
      .subscribe(resp => {
        this.miembros = resp;
        this.filterMiembros = this.miembros;     
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );

    }
   
  }

  delete(miembro: MiembroI): void {
    Swal.fire({
      title: 'Confirma Eliminar?',
      text: `A ${miembro.nomCompleto} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {  
        this.miembroService.delete(miembro.idMiembro).subscribe(resp => {
          this.ListarMiembrosMinisterio();
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

            })
          });

      }
    });
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

  agregarimg(item: MiembroI): void {
    this.router.navigate(['/detalle', item.idMiembro]);
  }

  pipeCumple(fn: Date) {
    var cumple = new Date(fn);
    return cumple.toJSON().slice(0, 10)

  }

  postular(miembro: MiembroI): void {   
      Swal.fire({
        icon: 'question',
        html: `
      <br>
      ¿Confirma postular a <b> ${miembro.nomCompleto} </b> al ciclo de U. de la vida?
      <br>      
      <select id="selectCiclo" class="form-select"  >
          <option value="-1">Seleccione el encuentro al que lo va a postular</option>
          ${this.generarOpcionesSelect()}         
      </select>                   
      <br> `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, postular!'
      }).then((result) => {
        if (result.isConfirmed) {
          let selectElement = document.getElementById('selectCiclo') as HTMLSelectElement;
          const selectedValue = selectElement.value;
          this.postuladoUvida.idUvida = null;
          if (selectedValue !== '-1') {

            this.obtonerSelect(selectedValue);

            this.postuladoUvida.idMiembro = miembro.idMiembro;
            this.postuladoUvida.usuarioIngreso = <string>localStorage.getItem("lidersistema");
            this.postuladoUvida.fechaIngreso = new Date();
            this.postuladoUvida.asistioEncuentro = false;
            this.postuladoUvida.bautizadoEncuentro = false;
            console.log(this.postuladoUvida);
            //necesito saber si ese discipulo ya fue postulado a ese ciclo para no volverlo hacer
            // if (!this.existePostulado(miembro.idMiembro, this.postuladoUvida.idUvida)) {

            this.postuladoServicio.postular(this.postuladoUvida).subscribe(resp => {
              Swal.fire({
                icon: 'success',
                title: `Ok`,
                text: `Se ingreso el postulado ${miembro.nomCompleto} con éxito, para que asista al proximo ciclo .`,
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

   /* }
    else {
      Swal.fire({
        icon: 'warning',
        title: `Denegado`,
        text: `El discipiulo ${miembro.nomCompleto}  no pudo ser postulado, por que ya esta postulado! `,
        showConfirmButton: false,
        timer: 2000
      });
    }*/
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
      this.listciclos.forEach((item: { idUvida: any; cicloUvida: any; fechaEncuentro: any; }) => {
        this.fechaCiclo=new Date(item.fechaEncuentro);
        if(this.fechaCiclo >= this.fechaActual)
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

  existePostulado(id: number): boolean {
    let existe = false;
    this.postuladoServicio.existePostulado().subscribe(resp => {
      let i = 0;
      this.discipulosPostulados = resp;
      while (i < this.discipulosPostulados.length && this.discipulosPostulados[i].idMiembro === id) {
        i++;
      }
      if (i < this.discipulosPostulados.length) {
        existe = true;
      }

    },
      err => {

        Swal.fire({
          icon: 'error',
          title: 'Error al buscar ...',
          text: 'No se pudo hacer la busqueda de postulados!',
          // footer: err.error.Error

        })
      });

    return existe;
  }

  
  generatePDF(): void { 
    const fileName = "MCI_Discipulos"  + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [220, 340],
      putOnlyUsedFonts: true
    });  
    autoTable(doc, { html: '#elementId' })       
    doc.save(fileName)
  }

  
public reporteTMinisterio(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
   head: [['Nro','Nombre del discipulo','Celular', 'Edad','Estado Civil', 'Discipulo', 'Encuentro','Bautizado', 'C.destino',  'Lider inmediato']],
   
    body: this.datosTMinisterio(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.text('Relación de miembros de la iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("TODOS") / 2);
      doc.text("TODOS", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta')) + 10, 32);
    },
    didDrawPage: function (data) {
      // Agrega el número de página en la parte superior derecha de cada página
      doc.setFontSize(10);
      doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
      doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
      doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
      doc.setLineWidth(1.3);       
      doc.setDrawColor(236,255,83); // draw red lines 
      doc.line(10, doc.internal.pageSize.height - 20, 10,doc.internal.pageSize.height - 5 ); 
      paginaActual++;  
    }          
  }); 
  var pdfDataUri = doc.output('datauri');
  var newWindow = window.open();
  if (newWindow) {
    newWindow.document.write('<iframe src="' + pdfDataUri + '" width="100%" height="100%"></iframe>');
  } else {
    // Manejar el caso en el que window.open() devuelve nulo
    console.error('No se pudo abrir una nueva ventana.');
  }
  // doc.save(fileName);

}

private datosTMinisterio() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterMiembros.length; i++) {  
    if(i<=200){
    const rowData = [
      contador.toString(),
      this.primerasmayusculas(this.filterMiembros[i].nomCompleto),
      this.filterMiembros[i].celular.toString(),      
      this.CalcularEdad(this.filterMiembros[i]),        
      this.filterMiembros[i].estadoCivil.toString(),     
     this.islider(this.filterMiembros[i].lider),
     this.respuesta(this.filterMiembros[i].uvida),
     this.respuesta(this.filterMiembros[i].bautizado),
     this.respuesta(this.filterMiembros[i].cdestino),
     this.filterMiembros[i].nombreLiderInmediato.toUpperCase()       
      
    ];
  
    data.push(rowData);
    contador++;
    }  
  }
     return data;
}

 
public reporteLMinisterio(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
   head: [['Nro','Nombre del discipulo','Celular', 'Edad','Estado Civil', 'Discipulo', 'Encuentro','Bautizado', 'C.destino',  'Lider inmediato']],
   
    body: this.datosLMinisterio(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.text('Relación de miembros de la iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Listado de lideres") / 2);
      doc.text("Listado de lideres", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta')) + 10, 32);
    },
    didDrawPage: function (data) {
      // Agrega el número de página en la parte superior derecha de cada página
      doc.setFontSize(10);
      doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
      doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
      doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
      doc.setLineWidth(1.3);       
      doc.setDrawColor(236,255,83); // draw red lines 
      doc.line(10, doc.internal.pageSize.height - 20, 10,doc.internal.pageSize.height - 5 ); 
      paginaActual++;  
    }          
  }); 
  var pdfDataUri = doc.output('datauri');
  var newWindow = window.open();
  if (newWindow) {
    newWindow.document.write('<iframe src="' + pdfDataUri + '" width="100%" height="100%"></iframe>');
  } else {
    // Manejar el caso en el que window.open() devuelve nulo
    console.error('No se pudo abrir una nueva ventana.');
  }
  // doc.save(fileName);

}

private datosLMinisterio() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterMiembros.length; i++) {  
    if(this.filterMiembros[i].lider){
    const rowData = [
      contador.toString(),
      this.primerasmayusculas(this.filterMiembros[i].nomCompleto),
      this.filterMiembros[i].celular.toString(),      
      this.CalcularEdad(this.filterMiembros[i]),        
      this.filterMiembros[i].estadoCivil.toString(),     
     this.islider(this.filterMiembros[i].lider),
     this.respuesta(this.filterMiembros[i].uvida),
     this.respuesta(this.filterMiembros[i].bautizado),
     this.respuesta(this.filterMiembros[i].cdestino),
     this.filterMiembros[i].nombreLiderInmediato.toUpperCase()       
      
    ];
  
    data.push(rowData);
    contador++;
    }  
  }
     return data;
}

 
public reporteTiMinisterio(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
   head: [['Nro','Nombre del discipulo','Celular', 'Edad','Estado Civil', 'Discipulo', 'Encuentro','Bautizado', 'C.destino',  'Lider inmediato']],
   
    body: this.datosTiMinisterio(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.text('Relación de miembros de la iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Listado de timoteos") / 2);
      doc.text("Listado de timoteos", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Relación de miembros de la iglesia MCI-Santa Marta')) + 10, 32);
    },
    didDrawPage: function (data) {
      // Agrega el número de página en la parte superior derecha de cada página
      doc.setFontSize(10);
      doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
      doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
      doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
      doc.setLineWidth(1.3);       
      doc.setDrawColor(236,255,83); // draw red lines 
      doc.line(10, doc.internal.pageSize.height - 20, 10,doc.internal.pageSize.height - 5 ); 
      paginaActual++;  
    }          
  }); 
  var pdfDataUri = doc.output('datauri');
  var newWindow = window.open();
  if (newWindow) {
    newWindow.document.write('<iframe src="' + pdfDataUri + '" width="100%" height="100%"></iframe>');
  } else {
    // Manejar el caso en el que window.open() devuelve nulo
    console.error('No se pudo abrir una nueva ventana.');
  }
  // doc.save(fileName);

}

private datosTiMinisterio() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterMiembros.length; i++) {  
    if(!this.filterMiembros[i].lider){
    const rowData = [
      contador.toString(),
      this.primerasmayusculas(this.filterMiembros[i].nomCompleto),
      this.filterMiembros[i].celular.toString(),      
      this.CalcularEdad(this.filterMiembros[i]),        
      this.filterMiembros[i].estadoCivil.toString(),     
     this.islider(this.filterMiembros[i].lider),
     this.respuesta(this.filterMiembros[i].uvida),
     this.respuesta(this.filterMiembros[i].bautizado),
     this.respuesta(this.filterMiembros[i].cdestino),
     this.filterMiembros[i].nombreLiderInmediato.toUpperCase()       
      
    ];
  
    data.push(rowData);
    contador++;
    }  
  }
     return data;
}
public respuesta(verifica: boolean): string {
  if (verifica) return "Si"
  else return "No"
 
}


public islider(verifica: boolean): string {
  if (verifica) return "Lider"
  else return "Timoteo"
}


public primerasmayusculas(str: string): string {
  if (!str) {
    return str;
  }
  str = str.toLowerCase();
  return str.replace(/\b\w/g, (char) => char.toLocaleUpperCase());
}

}
