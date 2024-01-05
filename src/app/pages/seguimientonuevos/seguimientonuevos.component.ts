import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NuevoI } from 'src/app/models/nuevo.model';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { PostuladosService } from 'src/app/servicios/postulados.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-seguimientonuevos',
  templateUrl: './seguimientonuevos.component.html',
  styleUrls: ['./seguimientonuevos.component.scss']
})
export class SeguimientonuevosComponent implements OnInit {
  nuevos!: any;
  filterNuevos: NuevoI[] | any;
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
    this.filterNuevos = this.listFilter ? this.performFilter(this.listFilter) : this.nuevos;
  }

  constructor(
    private nuevoService: NuevoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consolidaruvidaServicio: ConsolidarUvidaService, 
    private postuladoServicio: PostuladosService,
    private spinner: NgxSpinnerService) {
    //Preguntar si admin o de acuerdo a eso  listar listado de nuevo  
    this.ListarNuevosMinisterio();
    this.spinner.show();
    this.cargarCiclos();
    this.fechaActual = new Date() ;
    this.postuladoUvida = {};  

  }

  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.nuevos
    filterBy = filterBy.toLocaleLowerCase();
    return this.nuevos.filter((nuevo: any) => nuevo.nombreInvitado.toLocaleLowerCase().indexOf(filterBy) !== -1 
    || nuevo.nombroQuienInvita.toLocaleLowerCase().indexOf(filterBy) !== -1);
    //|| celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1 || celula.direccion.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  ngOnInit() {
    

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


  ListarNuevosMinisterio() {  
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
      this.nuevoService.getNuevosTodos()
      .subscribe(resp => {
        this.nuevos = resp;
        this.nuevos.sort((a: any, b:any) => b.fechaReunion.localeCompare(a.fechaReunion));
        this.filterNuevos = this.nuevos;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );

    }
    else{
      this.nuevoService.getNuevosMinisterio(liderAct)
      .subscribe(resp => {
        this.nuevos = resp;        
        this.filterNuevos = this.nuevos;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );
    }    
  }

  delete(nuevo: NuevoI): void { }

  agregarimg(idMiembro: number): void {
    this.router.navigate(['/detalle', idMiembro]);
  }

  
  postular(miembro: any): void {
    Swal.fire({
      icon: 'question',
      html: `
      <br>
      ¿Confirma postular a <b> ${miembro.nombreInvitado} </b> al ciclo de U. de la vida?
      <br>      
      <select id="selectCiclo" class="form-select"  >
          <option value="-1">Seleccione el encuentro al que lo va a postular</option>
          ${this.generarOpcionesSelect()}         
      </select>                   
      <br>
    `,

      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, postular!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let selectElement = document.getElementById('selectCiclo') as HTMLSelectElement;
        const selectedValue = selectElement.value;
        this.postuladoUvida.idUvida=null;
        if (selectedValue !== '-1') {         
          this.obtonerSelect(selectedValue);      
          this.postuladoUvida.idMiembro = miembro.idMiembro;
          this.postuladoUvida.usuarioIngreso = <string>localStorage.getItem("lidersistema");
          this.postuladoUvida.fechaIngreso = new Date();
          this.postuladoUvida.asistioEncuentro = false;
          this.postuladoUvida.bautizadoEncuentro = false;
                 
          this.postuladoServicio.postular(this.postuladoUvida).subscribe(resp => {
            Swal.fire({
              icon: 'success',
              title: `Ok`,
              text: `Se ingreso el postulad@ ${miembro.nombreInvitado} con éxito, para que asista al proximo ciclo .`,
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

vermas(miembro: any): void{
  Swal.fire({
    icon: 'info',  
      html: `
      <br>
      <b> ${miembro.nombreInvitado} </b>
      <br>      
       ${miembro.reunion}  ${miembro.fechaReunion}      
      <br>
      ${miembro.celular}     
      <br><b> Motivo de la oración  </b>
       <br>${miembro.motivoOracion} 
      <br>
      <br> Invitad@ por: ${miembro.nombroQuienInvita } 
      <br> lider Inmediato: ${miembro.nombreLiderInmediato} 
    `,
      
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
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

public reporteTGestion(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Fecha', 'Reunion', 'Nombre del nuevo', 'Tipo', 'Celular',  'Llamada', 'Visita.','Disposición', 'Invitado por', 'Lider inmediato']],
    body: this.datosTGestion(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación del ganar iglesia MCI-Santa Marta') / 2);
      doc.text('Relación del ganar iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Listado de nuevos") / 2);
      doc.text("Listado de nuevos", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta')) + 10, 32);
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

private datosTGestion() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterNuevos.length; i++) {   
    const rowData = [
      contador.toString(),
      this.filterNuevos[i].fechaReunion.toString(),
      this.filterNuevos[i].reunion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombreInvitado),
      this.isnuevo(this.filterNuevos[i].nuevo),
      this.filterNuevos[i].celular.toString(),     
      this.respuesta(this.filterNuevos[i].fonollamada),
      this.respuesta(this.filterNuevos[i].fonovisita),
      this.filterNuevos[i].disposicion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombroQuienInvita),    
      this.filterNuevos[i].nombreLiderInmediato.toUpperCase(),
      
    ];
    data.push(rowData);
    contador++;
    
  }
  //data.push(this.calcularTotalesRow());
     return data;
}

public reporteSGestion(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Fecha', 'Reunion', 'Nombre del nuevo', 'Tipo', 'Celular',  'Llamada', 'Visita.','Disposición', 'Invitado por', 'Lider inmediato']],
    body: this.datosSGestion(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación del ganar iglesia MCI-Santa Marta') / 2);
      doc.text('Relación del ganar iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Listado de gestionados") / 2);
      doc.text("Listado de gestionados", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta')) + 10, 32);
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

private datosSGestion() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterNuevos.length; i++) {
    if (this.filterNuevos[i].disposicion !="No gestionado") {
    const rowData = [
      contador.toString(),
      this.filterNuevos[i].fechaReunion.toString(),
      this.filterNuevos[i].reunion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombreInvitado),
      this.isnuevo(this.filterNuevos[i].nuevo),
      this.filterNuevos[i].celular.toString(),     
      this.respuesta(this.filterNuevos[i].fonollamada),
      this.respuesta(this.filterNuevos[i].fonovisita),
      this.filterNuevos[i].disposicion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombroQuienInvita),    
      this.filterNuevos[i].nombreLiderInmediato.toUpperCase(),
      
    ];
    data.push(rowData);
    contador++;
    }
  }
  //data.push(this.calcularTotalesRow());
     return data;
}

public reporteNGestion(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Fecha', 'Reunion', 'Nombre del nuevo', 'Tipo', 'Celular',  'Llamada', 'Visita.','Disposición', 'Invitado por', 'Lider inmediato']],
    body: this.datosNGestion(),
    startY: 33,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Relación del ganar iglesia MCI-Santa Marta') / 2);
      doc.text('Relación del ganar iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Listado de no gestionados") / 2);
      doc.text("Listado de no gestionados", titleXPos, 29);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta') / 2);
      doc.line(titleXPos - 10, 32, (titleXPos + doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta')) + 10, 32);
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

private datosNGestion() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterNuevos.length; i++) {
    if (this.filterNuevos[i].disposicion ==="No gestionado") {
    const rowData = [
      contador.toString(),
      this.filterNuevos[i].fechaReunion.toString(),
      this.filterNuevos[i].reunion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombreInvitado),
      this.isnuevo(this.filterNuevos[i].nuevo),
      this.filterNuevos[i].celular.toString(),     
      this.respuesta(this.filterNuevos[i].fonollamada),
      this.respuesta(this.filterNuevos[i].fonovisita),
      this.filterNuevos[i].disposicion.toString(),
      this.primerasmayusculas(this.filterNuevos[i].nombroQuienInvita),    
      this.filterNuevos[i].nombreLiderInmediato.toUpperCase(),
      
    ];
    data.push(rowData);
    contador++;
    }
  }
  //data.push(this.calcularTotalesRow());
     return data;
}

private calcularTotalesRow() {
  const consolidadoRow = [     
    '',
    'SUB - TOTALES :',
    this.calcularTotal('t1'),
    this.calcularTotal('t2'),
    this.calcularTotal('t3'),
    this.calcularTotal('t4'),
    this.calcularTotal('asistioEncuentro'),
    this.calcularTotal('bautizadoEncuentro'),
    this.calcularTotal('t5'),
    this.calcularTotal('t6'),
    this.calcularTotal('t7'),
    this.calcularTotal('t8'),
    this.calcularTotal('graduado'),     
  ];  
  return consolidadoRow;
}

private calcularTotal(columna: string): string {
  const total = this.postuladoUvida.reduce((accum: number, current: any) => {
    return accum + (current[columna] ? 1 : 0);
  }, 0);  
  return total.toString();
}

public respuesta(verifica: boolean): string {
  if (verifica) return "Si"
  else return "No"
}


public isnuevo(verifica: boolean): string {
  if (verifica) return "Nuevo"
  else return "Rescatado"
}


public primerasmayusculas(str: string): string {
  if (!str) {
    return str;
  }
  str = str.toLowerCase();
  return str.replace(/\b\w/g, (char) => char.toLocaleUpperCase());
}

}

