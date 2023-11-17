import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import { PostuladosService } from 'src/app/servicios/postulados.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-asistenciauvida',
  templateUrl: './asistenciauvida.component.html',
  styleUrls: ['./asistenciauvida.component.scss']
})
export class AsistenciauvidaComponent implements OnInit {
  isLoading: boolean = true;
  parametro: any;
  cicloAct: any;
  postuladoUvida: any;
  asistenciaUvidaForm!: FormGroup;
  filterPostulados: [] | any;
  //selectedCardIndex: number | null = null;
  postuladoActual: any;
  asistencias: string[] = ['t1', 't2', 't3', 't4', 'asistioEncuentro', 'bautizadoEncuentro', 't5', 't6', 't7', 't8', 'graduado'];

  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterPostulados = this.listFilter ? this.performFilter(this.listFilter) : this.postuladoUvida;
  }
  constructor(
    private consolidaruvidaServicio: ConsolidarUvidaService,
    private postuladosServicio: PostuladosService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.asistenciaUvidaForm = new FormGroup({});
    this.spinner.show();
    this.postuladoActual = {};


  }




  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.postuladoUvida
    filterBy = filterBy.toLocaleLowerCase();
    return this.postuladoUvida.filter((postu: any) => postu.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
      //|| postu.nomCompletoLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }


  ngOnInit(): void {
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.cargarCiclo();
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );
  }

  cargarCiclo() {
    this.consolidaruvidaServicio.getCiclo(this.parametro)
      .subscribe((ciclos: any) => {
        this.cicloAct = ciclos;        
        this.postuladoUvida = ciclos.postulados;
        this.postuladoUvida.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
        this.filterPostulados = this.postuladoUvida;
        this.asistenciaUvidaForm = this.fb.group({

        });
        this.postuladoUvida.forEach((postulado: any) => {

          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}`, this.fb.control(postulado.idPostulado));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t1`, this.fb.control(postulado.t1));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t2`, this.fb.control(postulado.t2));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t3`, this.fb.control(postulado.t3));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t4`, this.fb.control(postulado.t4));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_asistioEncuentro`, this.fb.control(postulado.asistioEncuentro));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_bautizadoEncuentro`, this.fb.control(postulado.bautizadoEncuentro));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t5`, this.fb.control(postulado.t5));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t6`, this.fb.control(postulado.t6));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t7`, this.fb.control(postulado.t7));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_t8`, this.fb.control(postulado.t8));
          this.asistenciaUvidaForm.addControl(`${postulado.idPostulado}_graduado`, this.fb.control(postulado.graduado));

        });

        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );
  }

  cadenaCorta(cadena: String): String {
    return cadena?.substring(0, 100);
  }

  actualizarAsistencia() {
    this.postuladoUvida.forEach((postulado: any) => {
      this.postuladoActual.idPostulado = postulado?.idPostulado;
      this.postuladoActual.t1 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t1`)?.value;
      this.postuladoActual.t2 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t2`)?.value;
      this.postuladoActual.t3 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t3`)?.value;
      this.postuladoActual.t4 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t4`)?.value;
      this.postuladoActual.t5 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t5`)?.value;
      this.postuladoActual.t6 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t6`)?.value;
      this.postuladoActual.t7 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t7`)?.value;
      this.postuladoActual.t8 = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_t8`)?.value;
      this.postuladoActual.asistioEncuentro = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_asistioEncuentro`)?.value;
      this.postuladoActual.bautizadoEncuentro = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_bautizadoEncuentro`)?.value;
      this.postuladoActual.graduado = this.asistenciaUvidaForm.get(`${postulado.idPostulado}_graduado`)?.value;
      console.log(this.postuladoActual);
      this.postuladosServicio.actualizarPostulados(this.postuladoActual)
        .subscribe((postAct: any) => { });
    });
    Swal.fire({
      icon: 'success',
      title: `Ok`,
      text: `Asistencia actualizada correctamente`,
    });

  }


  despostular(item: any): void {
    Swal.fire({
      title: 'Confirma?',
      text: `Quitar de la relacion de postulados a ${item.nomCompleto} en la base de datos!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, quitar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postuladosServicio.despostular(item.idPostulado).subscribe(resp => {
          this.postuladoUvida = this.postuladoUvida.filter((cli: any) => cli !== item);
          this.filterPostulados = this.postuladoUvida;

          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El discipulo ${item.nomCompleto} se ha quitado con éxito de la lista de postulados!`,
          });
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No se pudo quitar el discipulo de este ciclo de universidad de la vida!',
            })
          });
      }
    });
  }

  public cerificadosBautismoPDF(): void {
    const fileName = "Certificaciones_bautismo" + this.cicloAct.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    var doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    var imgData = '/assets/certificadobautismo.jpg';
    this.postuladoUvida.forEach((postulado: any) => {
      if (postulado.bautizadoEncuentro) {
        doc.setFontSize(30);
        doc.addImage(imgData, 'JPEG', 10, 10, 275, 190);
        var width = doc.internal.pageSize.getWidth()
        doc.text(postulado.nomCompleto, width / 2, 140, { align: 'center' });
        doc.setFontSize(10);
        doc.text("21      10      2023", width / 2, 175, { align: 'center' });
        doc.addPage();
      }
    });
    doc.save(fileName);
  }

  public cerificadoUvidaPDF(): void {
    const fileName = "Certificaciones_grado" + this.cicloAct.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    var doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    var imgData = '/assets/certificadouvida.jpg';
    this.postuladoUvida.forEach((postulado: any) => {
      if (postulado.graduado) {
        doc.addImage(imgData, 'JPEG', 10, 10, 275, 190);
        doc.setFontSize(30);
        var width = doc.internal.pageSize.getWidth()
        doc.text(postulado.nomCompleto, width / 2, 120, { align: 'center' });
        doc.addPage();
      }
    });
  

    doc.save(fileName);

  }

  exportarpdfindividualbautismo(item: any): void {    
    var doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    var imgData = '/assets/certificadobautismo.jpg';
    doc.addImage(imgData, 'JPEG', 10, 10, 275, 190);
    doc.setFontSize(30);
    var width = doc.internal.pageSize.getWidth()
    doc.text(item.nomCompleto, width / 2, 140, { align: 'center' });
    doc.setFontSize(10);
    doc.text("21      10      2023", width / 2, 175, { align: 'center' });
    doc.save('Certificado_bautismo.pdf');
  }

  exportarpdfindividualuvida(item: any): void {
    var doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    var imgData = '/assets/certificadouvida.jpg';
    doc.addImage(imgData, 'JPEG', 10, 10, 275, 190);
    doc.setFontSize(30);
    var width = doc.internal.pageSize.getWidth()
    doc.text(item.nomCompleto, width / 2, 120, { align: 'center' });
    doc.line(100, 30, width / 2, 125);
    doc.save('Certificado_uvida.pdf');
  }

  public asistenciaUvidaPDF(cicAct: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });  
    let paginaActual = 1; 
    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'T1', 'T2', 'T3', 'N1', 'E.', 'B.', 'T5', 'T6', 'T7', 'N2', 'G.', 'Lider inmediato']],
      body: this.datosAsistencia(),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 240, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Asistencia general al ciclo') / 2);
        doc.text('Listado de Asistencia general al ciclo', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.cicloUvida) / 2);
        doc.text(cicAct.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.citaRemha) / 2);
        doc.text(cicAct.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.nombreCoordinador) / 2);
        doc.text(cicAct.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(cicAct.nombreCoordinador)) + 10, 38);
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
       
      },
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

  private datosAsistencia() {
    const data = [];
    for (let i = 0; i < this.postuladoUvida.length; i++) {
      const rowData = [
        (i + 1).toString(),
        this.postuladoUvida[i].nomCompleto.toString(),
        this.respuesta(this.postuladoUvida[i].t1),
        this.respuesta(this.postuladoUvida[i].t2),
        this.respuesta(this.postuladoUvida[i].t3),
        this.respuesta(this.postuladoUvida[i].t4),
        this.respuesta(this.postuladoUvida[i].asistioEncuentro),
        this.respuesta(this.postuladoUvida[i].bautizadoEncuentro),
        this.respuesta(this.postuladoUvida[i].t5),
        this.respuesta(this.postuladoUvida[i].t6),
        this.respuesta(this.postuladoUvida[i].t7),
        this.respuesta(this.postuladoUvida[i].t8),
        this.respuesta(this.postuladoUvida[i].graduado),
        this.postuladoUvida[i].nomCompletoLiderInmediato.toString(),
      ];
      data.push(rowData);
    }
    data.push(this.calcularTotalesRow());
    return data;
  }

  private calcularTotal(columna: string): string {
    const total = this.postuladoUvida.reduce((accum: number, current: any) => {
      return accum + (current[columna] ? 1 : 0);
    }, 0);  
    return total.toString();
  }

  public respuesta(verifica: boolean): string {
    if (verifica) return "S"
    else return "-"
  }

  public asistenciaUvidaPDFPost(cicAct: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });  
    let paginaActual = 1;    
    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'T1', 'T2', 'T3', 'N1', 'E.', 'B.', 'T5', 'T6', 'T7', 'N2', 'G.', 'Lider inmediato']],
      body: this.datosAsistenciaPost(),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 240, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Asistencia Post-encuentro al ciclo') / 2);
        doc.text('Listado de Asistencia Post-encuentro al ciclo', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.cicloUvida) / 2);
        doc.text(cicAct.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.citaRemha) / 2);
        doc.text(cicAct.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.nombreCoordinador) / 2);
        doc.text(cicAct.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(cicAct.nombreCoordinador)) + 10, 38);
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

  private datosAsistenciaPost() {
    const data = [];
    let contador = 1;
    for (let i = 0; i < this.postuladoUvida.length; i++) {
      if (this.postuladoUvida[i].asistioEncuentro) {
      const rowData = [
        contador.toString(),
        this.postuladoUvida[i].nomCompleto.toString(),
        this.respuesta(this.postuladoUvida[i].t1),
        this.respuesta(this.postuladoUvida[i].t2),
        this.respuesta(this.postuladoUvida[i].t3),
        this.respuesta(this.postuladoUvida[i].t4),
        this.respuesta(this.postuladoUvida[i].asistioEncuentro),
        this.respuesta(this.postuladoUvida[i].bautizadoEncuentro),
        this.respuesta(this.postuladoUvida[i].t5),
        this.respuesta(this.postuladoUvida[i].t6),
        this.respuesta(this.postuladoUvida[i].t7),
        this.respuesta(this.postuladoUvida[i].t8),
        this.respuesta(this.postuladoUvida[i].graduado),
        this.postuladoUvida[i].nomCompletoLiderInmediato.toString(),
      ];
      data.push(rowData);
      contador++;
      }
    }
    data.push(this.calcularTotalesRow());
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

  public asistenciaUvidaPDFNoEncuentro(cicAct: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });  
    let paginaActual = 1;    
    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'T1', 'T2', 'T3', 'N1', 'E.', 'B.', 'T5', 'T6', 'T7', 'N2', 'G.', 'Lider inmediato']],
      body: this.datosAsistenciaNoEncuentro(),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 240, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado con asistencias pero no asistieron al encuentro') / 2);
        doc.text('Listado con asistencias pero no asistieron al encuentro', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.cicloUvida) / 2);
        doc.text(cicAct.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.citaRemha) / 2);
        doc.text(cicAct.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(cicAct.nombreCoordinador) / 2);
        doc.text(cicAct.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(cicAct.nombreCoordinador)) + 10, 38);
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
      },
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

  private datosAsistenciaNoEncuentro() {
    const data = [];
    let contador = 1;
    for (let i = 0; i < this.postuladoUvida.length; i++) {
      if (!this.postuladoUvida[i].asistioEncuentro) {
      const rowData = [
        contador.toString(),
        this.postuladoUvida[i].nomCompleto.toString(),
        this.respuesta(this.postuladoUvida[i].t1),
        this.respuesta(this.postuladoUvida[i].t2),
        this.respuesta(this.postuladoUvida[i].t3),
        this.respuesta(this.postuladoUvida[i].t4),
        this.respuesta(this.postuladoUvida[i].asistioEncuentro),
        this.respuesta(this.postuladoUvida[i].bautizadoEncuentro),
        this.respuesta(this.postuladoUvida[i].t5),
        this.respuesta(this.postuladoUvida[i].t6),
        this.respuesta(this.postuladoUvida[i].t7),
        this.respuesta(this.postuladoUvida[i].t8),
        this.respuesta(this.postuladoUvida[i].graduado),
        this.postuladoUvida[i].nomCompletoLiderInmediato.toString(),
      ];
      data.push(rowData);
      contador++;
      }
    }   
    return data;
  }


}


