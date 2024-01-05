import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { CelulaService } from 'src/app/servicios/celula.service';
import { CelulaI } from 'src/app/models/celula.model';
//import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-listcelula',
  templateUrl: './listcelula.component.html',
  styleUrls: ['./listcelula.component.scss']
})
export class ListcelulaComponent implements OnInit {
  celulas!: any;
  nombreActual = localStorage.getItem("nombsistema");
  filterCelulas: CelulaI[] | any;
  isLoading: boolean = true;
  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterCelulas = this.listFilter ? this.performFilter(this.listFilter) : this.celulas;
  }

  constructor(
    private celulaService: CelulaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) {

   this.spinner.show();
    this.ListarCelulasMinisterio();

  }

  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.celulas
    filterBy = filterBy.toLocaleLowerCase();
    return this.celulas.filter((celula: any) => celula.nombreLider.toLocaleLowerCase().indexOf(filterBy) !== -1
    || celula.barrio.toLocaleLowerCase().indexOf(filterBy) !== -1
    || celula.nombreLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  filtrarEstado(filterBy: string): any[] {  
    filterBy = filterBy.toLocaleLowerCase();
    return this.celulas.filter((celula: any) => celula.nombreLider.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit() {
    
  }
  onChangeVista(event: any){
  console.log(event);
   // Filtrar la lista dependiendo del estado del toggle
   if (event.checked) {
    // Mostrar solo elementos activos (puedes ajustar la lógica según tus necesidades)
    this.filterCelulas =    this.celulas.filter((item: string | string[]) => item.includes('Activa'));
  } else {
    // Mostrar todos los elementos
    this.filterCelulas =  this.celulas ;
  }
  }

  ListarCelulasMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");

    if (liderAct==='1202'){
    this.celulaService.getCelulas()
      .subscribe(resp => {
        this.celulas = resp;   
        this.filterCelulas = this.celulas;
        this.spinner.hide();
        this.isLoading = false;
      },
        err => { console.error(err) }
      );
    }
else{ 
  this.celulaService.getCelulasMinisterio(liderAct)
  .subscribe(respm => {
    this.celulas = respm;   
    this.filterCelulas = this.celulas;
    this.spinner.hide();
    this.isLoading = false;
  },
    err => { console.error(err) }
  );}

  }



  delete(celula: CelulaI): void { }

   // Función para generar el PDF desde un elemento HTML
/* generatePDF(): void { 
  const fileName = "MCI_Celulas"  + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  autoTable(doc, { html: '#elementId' })       
  doc.save(fileName)
}*/



public reporteCelulasActivas(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Lider celula', 'Anfitrion', 'Dirección celula', 'barrio', 'Dia',  'Hora', 'Red','Lider inmediato']],
    body: this.datosCelulasActivas(),
    startY: 26,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de celulas activas iglesia MCI-Santa Marta') / 2);
      doc.text('Listado de celulas activas iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de celulas activas iglesia MCI-Santa Marta') / 2);
      doc.line(titleXPos - 10, 24, (titleXPos + doc.getTextWidth('Listado de celulas activas iglesia MCI-Santa Marta')) + 10, 24);
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

private datosCelulasActivas() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterCelulas.length; i++) {
    if (this.filterCelulas[i].estado ==="Activa") {
    const rowData = [
      contador.toString(),
      this.primerasmayusculas(this.filterCelulas[i].nombreLider),
      this.primerasmayusculas(this.filterCelulas[i].nombreAnfitrion),
      this.filterCelulas[i].direccion.toString(),
      this.primerasmayusculas(this.filterCelulas[i].barrio),
      this.filterCelulas[i].diaCelula.toString(),
      this.filterCelulas[i].horaCelula.toString(),
      this.filterCelulas[i].nombreRed.toString(),
      this.primerasmayusculas(this.filterCelulas[i].nombreLiderInmediato)            
    ];
    data.push(rowData);
    contador++;
    }
  }
  //data.push(this.calcularTotalesRow());
     return data;
}

public reporteCelulasInactivas(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Estado','Lider celula', 'Anfitrion', 'Dirección celula', 'barrio', 'Dia',  'Hora', 'Red','Lider inmediato']],
    body: this.datosCelulasInactivas(),
    startY: 26,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de celulas inactivas iglesia MCI-Santa Marta') / 2);
      doc.text('Listado de celulas inactivas iglesia MCI-Santa Marta', titleXPos, 15);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth("Ministerio " + localStorage.getItem("nombsistema")) / 2);
      doc.text("Ministerio " + localStorage.getItem("nombsistema"), titleXPos, 22);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 189, 156);
      titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta') / 2);
      doc.line(titleXPos - 10, 24, (titleXPos + doc.getTextWidth('Listado de nuevos iglesia MCI-Santa MArta')) + 10, 24);
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

private datosCelulasInactivas() {
  const data = [];
  let contador = 1;
  for (let i = 0; i < this.filterCelulas.length; i++) {  
      if (this.filterCelulas[i].estado !="Activa") {
      const rowData = [
        contador.toString(),
        this.filterCelulas[i].estado.toString(),
        this.primerasmayusculas(this.filterCelulas[i].nombreLider),
        this.primerasmayusculas(this.filterCelulas[i].nombreAnfitrion),
        this.filterCelulas[i].direccion.toString(),
        this.primerasmayusculas(this.filterCelulas[i].barrio),
        this.filterCelulas[i].diaCelula.toString(),
        this.filterCelulas[i].horaCelula.toString(),
        this.filterCelulas[i].nombreRed.toString(),
        this.primerasmayusculas(this.filterCelulas[i].nombreLiderInmediato)      
    ];
    data.push(rowData);
    contador++;
    }
  }
  //data.push(this.calcularTotalesRow());
     return data;
}


public primerasmayusculas(str: string): string {
  if (!str) {
    return str;
  }
  str = str.toLowerCase();
  return str.replace(/\b\w/g, (char) => char.toLocaleUpperCase());
}


}
