import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoI } from 'src/app/models/evento.model';
import { EventoService } from 'src/app/servicios/evento.service';
import { PagoService } from 'src/app/servicios/pago.service';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {
  eventoForm!: FormGroup;
  keyword = 'nomCompleto';
  listEventos: any;
  listPagos: any;
  nombrebtn!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventoService: EventoService,
    private pagoService: PagoService,
  ) {

    this.nombrebtn = "Crear";
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarEventos();
  }

  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.eventoForm = this.fb.group
      ({
        idEvento: [''],
        nomEvento: ['', [Validators.required]],
        valorEvento: ['', [Validators.required]],
        fechaEvento: [new Date(), [Validators.required]],
        estado: ['true'],
        usuario: [''],
        fechaCreacion: [new Date()],

      });
  }


  mostrarDatos(itemt: EventoI) {
    this.nombrebtn = "Actualizar"
    var fn = new Date(itemt.fechaEvento);
    this.eventoForm.setValue({
      idEvento: itemt.idEvento,
      nomEvento: itemt.nomEvento,
      valorEvento: itemt.valorEvento,
      fechaEvento: fn.toJSON().slice(0, 10),
      estado: itemt.estado,
      usuario: itemt.usuario,
      fechaCreacion: itemt.fechaCreacion,
    })

  }


  create() {
    this.eventoForm.value.usuario = localStorage.getItem("lidersistema");
    if (this.eventoForm.status == 'VALID') {
      if (this.nombrebtn == "Crear") {
        this.eventoForm.value.fechaCreacion = new Date();
        this.eventoService.create(this.eventoForm.value).subscribe(ciclo => {
          this.cargarEventos();
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El evento ${this.eventoForm.value.nomEvento} ha sido creado correctamente`,
          });
          this.eventoForm.reset();
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: `No se pudo guardar el evento ${this.eventoForm.value.nomEvento} en la base de datos!`,
              footer: err.mensaje //JSON.stringify(err)
            });
          }
        );
      }
      else {
        this.eventoService.update(this.eventoForm.value).subscribe(ciclo => {
          this.cargarEventos();
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El evento  ${this.eventoForm.value.nomEvento} ha sido actualizado correctameente`,
          });
          this.eventoForm.reset();

        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'No se pudo actualizar el evento en la base de datos!',
              footer: err.mensaje
            });
          });
      }

    } else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para crear el evento'
      });

    }

  }

  cargarEventos() {
    this.listEventos = null;
    this.eventoService.getEventos()
      .subscribe((ciclos: EventoI) => {
        this.listEventos = ciclos;
      },
        (err: any) => { console.error(err) }
      );
  }


  eliminarEvento(itemt: EventoI) {
    Swal.fire({
      title: 'Desea eliminar?',
      text: `El evento  ${itemt.nomEvento} de la base de datos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.delete(itemt.idEvento).subscribe(resp => {
          this.listEventos = this.listEventos.filter((cli: EventoI) => cli !== itemt);
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El evento ${itemt.nomEvento} ha sido eliminado correctamente.`,
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

  pagosEvento(evento: any): void {
    this.buscarPagos(evento).then((bodyData) => {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [220, 340],
      putOnlyUsedFonts: true
    });
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'Fecha', 'Id pago', 'Valor', 'Medio', 'Lider inmediato','Nombre RG12']],
      body: bodyData,
      startY: 28,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado detallado de pagos del evento') / 2);
        doc.text('Listado detallado de pagos del evento', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(evento.nomEvento) / 2);
        doc.text(evento.nomEvento, titleXPos, 22);
       
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 25, (titleXPos + doc.getTextWidth(evento.nomEvento)) + 10, 25);
      },
      didDrawPage: function (data) {   // Agrega pie de pagina

        doc.setFontSize(10);
        //doc.addImage('/assets/piepagina.jpg', 'JPEG', 5, 255, 50, 20);
        doc.text('Página ' + paginaActual, 250, doc.internal.pageSize.height - 10);
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
  });
  }

  private async buscarPagos(evento: any): Promise<RowInput[] | undefined> {
    const data: RowInput[] = [];
    this.listPagos = null;
    let contador = 0;  
    try {
      const resp: any = await this.pagoService.getPagosXEvento(evento.idEvento).toPromise();
      this.listPagos = resp;
      this.listPagos.forEach((element: any) => {
        const rowData: RowInput = [         
          (contador + 1).toString(),
          element.nomCompleto.toString(), // Debes proporcionar el valor correcto aquí
          element.fechaPago.toString(), // Debes proporcionar el valor correcto aquí
          element.idPago.toString(), // Debes proporcionar el valor correcto aquí
          element.valorPago.toString(), // Debes proporcionar el valor correcto aquí
          element.medioPago.toString(), // Debes proporcionar el valor correcto aquí
          element.nomLider.toString(),
          element.nomUsuario.toString(), // Debes proporcionar el valor correcto aquí
        ];
        data.push(rowData);
        contador++;
      });
      data.push(this.calcularTotalesRow());
      return data.length > 0 ? data : undefined;
    } catch (err) {     
  console.error(err);
      return undefined;
    }
  }
  
   
  pagosEventoCruzado(evento: any): void {
    this.buscarPagosCruzado(evento).then((bodyData) => {
    //const fileName = "MCI_Encuentro" + ciclolistar.cicloUvida.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [220, 340],
      putOnlyUsedFonts: true
    });
    let paginaActual = 1;

    autoTable(doc, {
      head: [['Nro', 'Nombre del discípulo', 'Efectivo', 'Datafono', 'Transferencia','Bono','Total','Saldo','Lider inmediato']],
      body: bodyData,
      startY: 28,
      //theme: 'striped',
      theme: 'grid',
      willDrawPage: function (data) {
        doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 15, 60);
        doc.addImage('/assets/logo.jpg', 'JPEG', 290, 5, 20, 20);
        let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Listado consolidado de pagos del evento') / 2);
        doc.text('Listado consolidado de pagos del evento', titleXPos, 15);
        titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(evento.nomEvento) / 2);
        doc.text(evento.nomEvento, titleXPos, 22);       
        doc.setLineWidth(0.5);
        doc.setDrawColor(26, 189, 156);
        doc.line(titleXPos - 10, 25, (titleXPos + doc.getTextWidth(evento.nomEvento)) + 10, 25);
      },
      didDrawPage: function (data) {   // Agrega pie de pagina
        doc.setFontSize(10);
        //doc.addImage('/assets/piepagina.jpg', 'JPEG', 5, 255, 50, 20);
        doc.text('Página ' + paginaActual, 250, doc.internal.pageSize.height - 10);
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
  });
  }

  private async buscarPagosCruzado(evento: any): Promise<RowInput[] | undefined> {
    const data: RowInput[] = [];
    this.listPagos = null;
    let contador = 0;  
    try {
      const resp: any = await this.pagoService.getPagosXEventoCruzado(evento.idEvento).toPromise();
      this.listPagos = resp;
      this.listPagos.forEach((element: any) => {
        const rowData: RowInput = [   
          (contador + 1),
          element.nomCompleto, // Debes proporcionar el valor correcto aquí
          element.tefectivo, // Debes proporcionar el valor correcto aquí
          element.tdatafono, // Debes proporcionar el valor correcto aquí
          element.ttransferencia, // Debes proporcionar el valor correcto aquí
          element.tbono, // Debes proporcionar el valor correcto aquí
          (element.tefectivo+ element.ttransferencia+element.tdatafono+element.tbono), // Debes proporcionar el valor correcto aquí
          (evento.valorEvento-(element.tefectivo+ element.ttransferencia+element.tdatafono+element.tbono)), // Debes proporcionar el valor correcto aquí
          element.nomlider,
        ];
        data.push(rowData);
        contador++;
      });
      data.push(this.calcularTotalesRow());
      return data.length > 0 ? data : undefined;
    } catch (err) {     
  console.error(err);
      return undefined;
    }
  }
  
  private calcularTotalesRow() {   
    const consolidadoRow = [     
      '',
      'SUB - TOTALES :',
      this.calcularTotal('tefectivo'),
      this.calcularTotal('tdatafono'),
      this.calcularTotal('ttransferencia'),
      this.calcularTotal('tbono'),
      '',
      '',
      '',          
    ];  
    return consolidadoRow;
  }
  
  private calcularTotal(columna: string): string {
    const total = this.listPagos.reduce((accum: number, current: any) => {
      const valor = parseFloat(current[columna]) || 0; // Convertir el valor a número o usar 0 si no es un número
      return accum + valor;
    }, 0);
  
    return total.toString();
  }


}

