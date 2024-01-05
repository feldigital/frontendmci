import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-gestionarofrenda',
  templateUrl: './gestionarofrenda.component.html',
  styleUrls: ['./gestionarofrenda.component.scss']
})
export class GestionarofrendaComponent implements OnInit {
  listtema: any;

  filterOfrenda: ReporteCelula[] | any;
  _listFilter!: string;
  isLoading: boolean = true;
  nombreActual = localStorage.getItem("nombsistema");
  temaCelula: ReporteCelula=new ReporteCelula();




  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterOfrenda = this.listFilter ? this.performFilter(this.listFilter) : this.listtema;
  }


  constructor(
    private reportecelulaSevicio: ReporteCelulaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService) {
    this.spinner.show();
  }


  performFilter(filterBy: string): ReporteCelula[] {
    if (filterBy === '' || filterBy.length < 3) return this.listtema
    filterBy = filterBy.toLocaleLowerCase();
    return this.listtema.filter((tema: any) => tema.nombreLiderCelula.toLocaleLowerCase().indexOf(filterBy) !== -1
     || tema.nombreRed.toLocaleLowerCase().indexOf(filterBy) !== -1
     || tema.nombreMedio.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit() {
    this.cargarTemasMinisterio();
  }

  cargarTemasMinisterio() {
    this.listtema = null;
    let liderAct = localStorage.getItem("lidersistema");
    if (liderAct==='1202'){
    this.reportecelulaSevicio.getTemas()
      .subscribe((resp: any) => {
        this.listtema = resp;
        this.filterOfrenda = this.listtema;
        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );

    }
    else{ this.reportecelulaSevicio.getTemasMinisterio(liderAct)
      .subscribe((resp: any) => {
        this.listtema = resp;
        this.filterOfrenda = this.listtema;
        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );}
  }

  Verificar(itemt: any) {     
    this.reportecelulaSevicio.getReporteIdRealizacion(itemt.idRealizacionCelula).subscribe(temaCelula => {
      if (itemt.verificada === true){
      temaCelula.verificada = false; 
      itemt.verificada = false;
    }else {temaCelula.verificada = true;
      itemt.verificada = true;}
      temaCelula.usuarioVer = <string>localStorage.getItem("lidersistema");
      temaCelula.fecVerificada = new Date();  
      console.log(temaCelula) ;
      this.reportecelulaSevicio.update(temaCelula).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: `La celula de ${itemt.nombreLiderCelula} ha sido verificada correctamente!`,
        });
      },
        err => {
          console.error(err)
        });
    },
      err => {
        console.error(err)
      });  
  }

  
  verAsistente(tem: any) {   
    Swal.fire({
      icon: 'info',
      title: `Información`,
      text: `Proximamente podras ver quienes te asistieron......`,          
    });
}

 // Función para generar el PDF desde un elemento HTML
 generatePDF(): void { 
  const fileName = "MCI_Reporte_tema"  + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  autoTable(doc, { html: '#elementId' })       
  doc.save(fileName)
}



public reporteTemas(): void {
  //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'mm',
    format: [220, 340],
    putOnlyUsedFonts: true
  });  
  let paginaActual = 1;    
  autoTable(doc, {
    head: [['Nro','Fecha','Lider de celula', 'Nombre del tema', 'Cita bíblica', '#Asist','Medio','Red', 'Lider inmediato']],
    body: this.datosTemas(),
    startY: 26,
    //theme: 'striped',
    theme: 'grid',
    willDrawPage: function (data) {
      doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
      doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
      let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de temas celulas iglesia MCI-Santa Marta') / 2);
      doc.text('Listado de temas celulas iglesia MCI-Santa Marta', titleXPos, 15);
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

private datosTemas() {
  const data = [];
  let contador = 1;
  console.log(this.filterOfrenda);
  for (let i = 0; i < this.filterOfrenda.length; i++) {
   // [['Nro','Semana','Fecha','Lider de celula', 'Nombre del tema', 'Cita bíblica', '# Asistente', 'Lider inmediato','Estado']],
    const rowData = [
      contador.toString(),
      this.filterOfrenda[i].fechaCelula.toString(),
      this.primerasmayusculas(this.filterOfrenda[i].nombreLiderCelula),
      this.primerasmayusculas(this.filterOfrenda[i].temaCelula),
      this.primerasmayusculas(this.filterOfrenda[i].citaCelula),
      this.filterOfrenda[i].nroAsistentes.toString(),
      this.primerasmayusculas(this.filterOfrenda[i].nombreMedio),
      this.filterOfrenda[i].nombreRed.toString(),
      this.primerasmayusculas(this.filterOfrenda[i].nombreLiderInmediato)
];
    data.push(rowData);
    contador++;
    
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
