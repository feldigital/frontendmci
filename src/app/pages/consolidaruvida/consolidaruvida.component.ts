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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  idCoordinador: any;
  parametro: any;
  listciclos: any;
  nombrebtn!: string
  contador!: number;
  tPostulados!: any;

  constructor(
    private fb: FormBuilder,
    private miembroService: MiembroService,
    private celulaServicio: CelulaService,
    private router: Router,
    private consolidaruvidaServicio: ConsolidarUvidaService
  ) {
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
        fechaEncuentro: [new Date().toISOString().split('T')[0], [Validators.required]],
        idRed: ['', [Validators.required]],
        estado: ['true'],
        usuario: [''],
        fechaCreacion: [new Date()],

      });
  }


  mostrarDatos(itemt: ConsolidarUvidaI) {
    this.nombrebtn = "Actualizar"
    var fn = new Date(itemt.fechaEncuentro);
    console.log(this.uvidaForm.value);
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
    //this.uvidaForm.get('idMiembroCoordinador')?.setValue(itemt.idMiembroCoordinador);
  }


  create() {
    this.uvidaForm.value.usuario = localStorage.getItem("lidersistema");
    console.log(this.uvidaForm.value);
    if (this.uvidaForm.status == 'VALID') {     
      console.log(this.uvidaForm.value);
        if (this.nombrebtn == "Crear") {
          this.uvidaForm.value.fechaCreacion = new Date();       
          this.consolidaruvidaServicio.create(this.uvidaForm.value).subscribe(ciclo => {
            console.log(ciclo);
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
        else {
          this.consolidaruvidaServicio.update(this.uvidaForm.value).subscribe(ciclo => {
            console.log(ciclo);
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
    let liderAct = localStorage.getItem("lidersistema");
    this.miembroService.getMiembrosLideres(liderAct)  
      .subscribe((resp: MiembroI) => {
        this.lideres = resp;
      },
        (err: any) => { console.error(err) }
      );
  }
 

  listadoPostulados(ciclolistar: any): void {
    // const fileName = "MCI_POSTULADOS" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });
    const totalPagesExp = '{total_pages_count_string}';
    let paginaActual = 1;
    const fuentePersonalizada = 'Wingdings 2'; // Puedes cambiar esto a la fuente que desees
    const columnaConFuentePersonalizada = 4; // Índice de la columna (0 para la primera columna)

    const columnStyles = {
      [columnaConFuentePersonalizada]: {
        font: fuentePersonalizada,
      },
    };

    let startY = 40;  // Establece la posición vertical inicial para la primera página
    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'E.', 'B.', 'G.', 'Lider inmediato']],
      body: this.datosPostulados(ciclolistar),
      startY: startY,
      //theme: 'striped',
      theme: 'grid',
      columnStyles: columnStyles,
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 190, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Postulados') / 2);
        doc.text('Listado de Postulados', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.cicloUvida) / 2);
        doc.text(ciclolistar.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.citaRemha) / 2);
        doc.text(ciclolistar.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.nombreCoordinador) / 2);
        doc.text(ciclolistar.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(ciclolistar.nombreCoordinador)) + 10, 38);
      },
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
        doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
        doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
        doc.setLineWidth(1.3);
        doc.setDrawColor(236, 255, 83); // draw red lines 
        doc.line(10, doc.internal.pageSize.height - 20, 10, doc.internal.pageSize.height - 5);
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

  private datosPostulados(cic: any) {
    const data = [];
    this.tPostulados = cic.postulados
    this.tPostulados = this.tPostulados.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
    for (let i = 0; i < this.tPostulados.length; i++) {
      const rowData = [
        (i + 1).toString(),
        this.tPostulados[i].nomCompleto.toString(),
        this.respuesta(this.tPostulados[i].asistioEncuentro),
        this.respuesta(this.tPostulados[i].bautizadoEncuentro),
        this.respuesta(this.tPostulados[i].graduado),
        this.tPostulados[i].nomCompletoLiderInmediato.toString(),
      ];
      data.push(rowData);
    }
    data.push(this.calcularTotalesRow());
    return data;
  }

  public respuesta(verifica: boolean): string {
    if (verifica) return "S"
    else return "-"
  }

  ListadoEncuentro(ciclolistar: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });
    let totalPagesExp = '{total_pages_count_string}';
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'E.', 'B.', 'G.', 'Lider inmediato']],
      body: this.datosEncuentro(ciclolistar),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 190, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Asistente a Encuentro') / 2);
        doc.text('Listado de Asistente a Encuentro', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.cicloUvida) / 2);
        doc.text(ciclolistar.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.citaRemha) / 2);
        doc.text(ciclolistar.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.nombreCoordinador) / 2);
        doc.text(ciclolistar.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(ciclolistar.nombreCoordinador)) + 10, 38);
      },
      didDrawPage: function (data) {   // Agrega pie de pagina

        doc.setFontSize(10);
        //doc.addImage('/assets/piepagina.jpg', 'JPEG', 5, 255, 50, 20);
        doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
        doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
        doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
        doc.setLineWidth(1.3);
        doc.setDrawColor(236, 255, 83); // draw red lines 
        doc.line(10, doc.internal.pageSize.height - 20, 10, doc.internal.pageSize.height - 5);
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




  private datosEncuentro(cic: any) {
    const data = [];
    this.contador = 1;
    this.tPostulados = cic.postulados
    this.tPostulados = this.tPostulados.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
    for (let i = 0; i < this.tPostulados.length; i++) {
      if (this.tPostulados[i].asistioEncuentro) {
        const rowData = [this.contador.toString(),
        this.tPostulados[i].nomCompleto.toString(),
        this.respuesta(this.tPostulados[i].asistioEncuentro),
        this.respuesta(this.tPostulados[i].bautizadoEncuentro),
        this.respuesta(this.tPostulados[i].graduado),
        this.tPostulados[i].nomCompletoLiderInmediato.toString(),
        ];
        data.push(rowData);
        this.contador++;
      }
    }
    data.push(this.calcularTotalesRow());
    return data;
  }


  ListadoBautismo(ciclolistar: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });
    let totalPagesExp = '{total_pages_count_string}';
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'E.', 'B.', 'G.', 'Lider inmediato']],
      body: this.datosBautismo(ciclolistar),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 190, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Asistente a Bautizo') / 2);
        doc.text('Listado de Asistente a Bautizo', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.cicloUvida) / 2);
        doc.text(ciclolistar.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.citaRemha) / 2);
        doc.text(ciclolistar.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.nombreCoordinador) / 2);
        doc.text(ciclolistar.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(ciclolistar.nombreCoordinador)) + 10, 38);
      },
      didDrawPage: function (data) {
        // Agrega el número de página en la parte superior derecha de cada página
        doc.setFontSize(10);
        doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
        doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
        doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
        doc.setLineWidth(1.3);
        doc.setDrawColor(236, 255, 83); // draw red lines 
        doc.line(10, doc.internal.pageSize.height - 20, 10, doc.internal.pageSize.height - 5);
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

  private datosBautismo(cic: any) {
    const data = [];
    this.contador = 1;
    this.tPostulados = cic.postulados
    this.tPostulados = this.tPostulados.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
    for (let i = 0; i < this.tPostulados.length; i++) {
      if (this.tPostulados[i].bautizadoEncuentro) {
        const rowData = [this.contador.toString(),
        this.tPostulados[i].nomCompleto.toString(),
        this.respuesta(this.tPostulados[i].asistioEncuentro),
        this.respuesta(this.tPostulados[i].bautizadoEncuentro),
        this.respuesta(this.tPostulados[i].graduado),
        this.tPostulados[i].nomCompletoLiderInmediato.toString(),
        ];
        data.push(rowData);
        this.contador++;
      }
    }
    data.push(this.calcularTotalesRow());
    return data;
  }


  ListadoGrado(ciclolistar: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });
    let totalPagesExp = '{total_pages_count_string}';
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'E.', 'B.', 'G.', 'Lider inmediato']],
      body: this.datosGrado(ciclolistar),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 190, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de Asistente a Grado') / 2);
        doc.text('Listado de Asistente a Grado', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.cicloUvida) / 2);
        doc.text(ciclolistar.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.citaRemha) / 2);
        doc.text(ciclolistar.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.nombreCoordinador) / 2);
        doc.text(ciclolistar.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(ciclolistar.nombreCoordinador)) + 10, 38);
      },
      didDrawPage: function (data) {
        // Agrega el número de página en la parte superior derecha de cada página
        doc.setFontSize(10);
        doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
        doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
        doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
        doc.setLineWidth(1.3);
        doc.setDrawColor(236, 255, 83); // draw red lines 
        doc.line(10, doc.internal.pageSize.height - 20, 10, doc.internal.pageSize.height - 5);
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


  private datosGrado(cic: any) {
    const data = [];
    this.contador = 1;
    this.tPostulados = cic.postulados
    this.tPostulados = this.tPostulados.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
    for (let i = 0; i < this.tPostulados.length; i++) {
      if (this.tPostulados[i].graduado) {
        const rowData = [this.contador.toString(),
        this.tPostulados[i].nomCompleto.toString(),
        this.respuesta(this.tPostulados[i].asistioEncuentro),
        this.respuesta(this.tPostulados[i].bautizadoEncuentro),
        this.respuesta(this.tPostulados[i].graduado),
        this.tPostulados[i].nomCompletoLiderInmediato.toString(),
        ];
        data.push(rowData);
        this.contador++;
      }
    }
    data.push(this.calcularTotalesRow());
    return data;
  }

  listadoNoEncuentro(ciclolistar: any): void {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });
    let totalPagesExp = '{total_pages_count_string}';
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'E.', 'B.', 'G.', 'Lider inmediato']],
      body: this.datosNoEncuentro(ciclolistar),
      startY: 40,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 190, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado de postulados con asistencia y no encuentro') / 2);
        doc.text('Listado de postulados con asistencia y no encuentro', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.cicloUvida) / 2);
        doc.text(ciclolistar.cicloUvida, titleXPos, 22);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.citaRemha) / 2);
        doc.text(ciclolistar.citaRemha, titleXPos, 29);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(ciclolistar.nombreCoordinador) / 2);
        doc.text(ciclolistar.nombreCoordinador, titleXPos, 36);
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 38, (titleXPos + doc.getTextWidth(ciclolistar.nombreCoordinador)) + 10, 38);
      },
      didDrawPage: function (data) {
        // Agrega el número de página en la parte superior derecha de cada página
        doc.setFontSize(10);
        doc.text('Página ' + paginaActual, 185, doc.internal.pageSize.height - 10);
        doc.text('Calle 15 # 20-17 Barrio Jardin, Tel: 4239150 ', 12, doc.internal.pageSize.height - 12);
        doc.text('Cel: 3157033591, Email: santamarta@mci12.com', 12, doc.internal.pageSize.height - 7);
        doc.setLineWidth(1.3);
        doc.setDrawColor(236, 255, 83); // draw red lines 
        doc.line(10, doc.internal.pageSize.height - 20, 10, doc.internal.pageSize.height - 5);
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


  private datosNoEncuentro(cic: any) {
    const data = [];
    this.contador = 1;
    this.tPostulados = cic.postulados
    this.tPostulados = this.tPostulados.sort((a: any, b: any) => a.nomCompleto.localeCompare(b.nomCompleto));
    for (let i = 0; i < this.tPostulados.length; i++) {
      if (!this.tPostulados[i].asistioEncuentro) {
        const rowData = [this.contador.toString(),
        this.tPostulados[i].nomCompleto.toString(),
        this.respuesta(this.tPostulados[i].asistioEncuentro),
        this.respuesta(this.tPostulados[i].bautizadoEncuentro),
        this.respuesta(this.tPostulados[i].graduado),
        this.tPostulados[i].nomCompletoLiderInmediato.toString(),
        ];
        data.push(rowData);
        this.contador++;
      }
    }
    return data;
  }


  
  private calcularTotal(columna: string): string {
    const total = this.tPostulados.reduce((accum: number, current: any) => {
      return accum + (current[columna] ? 1 : 0);
    }, 0);  
    return total.toString();
  }
  private calcularTotalesRow() {
    const consolidadoRow = [     
      '',
      'SUB - TOTALES :',     
      this.calcularTotal('asistioEncuentro'),
      this.calcularTotal('bautizadoEncuentro'),     
      this.calcularTotal('graduado'),    
      '', 
    ];  
    return consolidadoRow;
  }

}

