import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { EventoI } from 'src/app/models/evento.model';
import { MensajeI } from 'src/app/models/mensaje.model';
import { MiembroI } from 'src/app/models/miembro.model';
import { PagoI } from 'src/app/models/pago.model';
import { EventoService } from 'src/app/servicios/evento.service';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { PagoService } from 'src/app/servicios/pago.service';
import { WhatsappService } from 'src/app/servicios/whatsapp.service';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent implements OnInit {




  registro: any;
  listEventos: any;
  lideres: any;
  pagoForm!: FormGroup;
  pagoNuevo: PagoI = new PagoI();
  eventoSeleccionado!: number;
  discipuloSeleccionado!: boolean;
  listPagos: any;
  parametro: any;
  habilitarRecibo: boolean = false;
  pagoRecibo: any;
  mensajeWhat: MensajeI = new MensajeI();

  constructor(private fb: FormBuilder,
    private miembroService: MiembroService,
    private eventoService: EventoService,
    private pagoService: PagoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private whatsappService: WhatsappService
  ) {

    this.cargarEventos();
    this.crearFormulario();
    this.registro = null;
    this.eventoSeleccionado = -1;
    this.discipuloSeleccionado = false;
    this.pagoRecibo = null;


  }
  ngOnInit(): void {
    this.parametro = this.activatedRoute.snapshot.params.id;
    this.BuscarDocumento(this.parametro);
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.parametro = params.parametro;
      }
    );

  }

  cargarEventos() {
    this.listEventos = null;
    this.eventoService.getEventosActivos()
      .subscribe((ciclos: EventoI) => {
        this.listEventos = ciclos;
      },
        (err: any) => { console.error(err); }
      );
  }

  /*FUNCION DE CREACION DEL FORMULARIO*/
  crearFormulario() {
    this.pagoForm = this.fb.group({
      idPago: [''],
      idEvento: ['', [Validators.required]],
      valorPago: ['', [Validators.required]],
      numDocumento: [''],
      medioPago: ['', [Validators.required]],
      fechaPago: [new Date().toISOString().split('T')[0], [Validators.required]],
      obsPago: ['']
    });
  }

  create(): void {
    this.habilitarRecibo = false;
    this.pagoRecibo = null;
    if (this.pagoForm.status == 'VALID' && (this.pagoForm.get('valorPago')?.value > 0)) {
      if (this.discipuloSeleccionado) {
        if (this.getAbonoCorrecto()) {
          Swal.fire({
            icon: 'error',
            title: "Verificar",
            text: `El abono a nombre de ${this.registro.nomCompleto} es mayor que su saldo actual.`
          });
        } else {
          this.pagoNuevo.idPago = this.pagoForm.get('idPago')?.value;
          this.pagoNuevo.idEvento = this.pagoForm.value.idEvento.idEvento;
          this.pagoNuevo.idMiembro = this.registro.idMiembro; // Accede a idMiembro del registro
          this.pagoNuevo.valorPago = this.pagoForm.get('valorPago')?.value;
          this.pagoNuevo.fechaPago = this.pagoForm.get('fechaPago')?.value;
          this.pagoNuevo.medioPago = this.pagoForm.get('medioPago')?.value;
          this.pagoNuevo.obsPago = this.pagoForm.get('obsPago')?.value;
          this.pagoNuevo.usuario = <string>localStorage.getItem("lidersistema");
          this.pagoNuevo.fechaCreacion = new Date();
          this.pagoNuevo.nomUsuario = <string>localStorage.getItem("nombsistema");
          
          this.pagoService.create(this.pagoNuevo).subscribe((resp: any) => {
            Swal.fire({
              icon: 'success',
              title: "OK",
              text: `El abono a nombre de ${this.registro.nomCompleto} se realizó correctamente.`
            });
            this.habilitarRecibo = true;
            this.pagoRecibo = resp.pagos;
            this.descargarReciboPDF(this.pagoRecibo);
            this.pagoForm.controls['valorPago'].setValue('');
            this.pagoForm.controls['fechaPago'].setValue(new Date().toISOString().split('T')[0]);
            this.pagoForm.controls['medioPago'].setValue('');
            this.pagoForm.controls['obsPago'].setValue('');
            //this.pagoForm.controls['numDocumento'].setValue('');
            //this.discipuloSeleccionado = false;
            //this.listPagos = null;
            this.BuscarDocumento(this.pagoForm.get('numDocumento')?.value);
          }),
            (err: any) => { console.error(err); };
        }
      }
      else {
        Swal.fire({
          icon: 'warning',
          title: "!Alerta",
          text: 'El documento ingresado para realizar el pago no existe en la base de datos'
        });
      }



    }
    else {
      Swal.fire({
        icon: 'warning',
        title: "!Alerta",
        text: 'Datos incompletos para registrar el pago '
      });
    }
  }


  BuscarDocumento(documento: string) {
    this.registro = null;
    this.discipuloSeleccionado = false;
    this.pagoForm.controls['numDocumento'].setValue(documento);
    this.miembroService.getMiembrosDocumento(documento)
      .subscribe((resp: MiembroI) => {
        this.registro = resp;
        this.registro = this.registro[0];
        this.discipuloSeleccionado = true;
        this.buscarPagos();
      })
      ,
      (err: any) => { console.error(err); };
  }

  valor(item: any) {
    this.eventoSeleccionado = item.valorEvento;
    this.buscarPagos();
  }

  buscarPagos() {
    this.listPagos = null;
    if (this.eventoSeleccionado >= 0 && this.discipuloSeleccionado) {
      this.pagoService.getPagosXEventoXDiscipulo(this.pagoForm.value.idEvento.idEvento, this.registro?.idMiembro)
        .subscribe((resp: any) => {
          this.listPagos = resp;

        }),
        (err: any) => { console.error(err); };
    }
  }

  getTotalValorPagado(): number {
    if (this.listPagos) {
      return this.listPagos.reduce((total: any, item: { valorPago: any; }) => total + item.valorPago, 0);
    } else {
      return 0; // Retorna 0 si listPagos es null
    }
  }
  getSaldoEvento(): number {
    return (this.eventoSeleccionado - this.getTotalValorPagado());
  }

  getCssClass(value: number): string {
    return value == 0 ? 'positive-value' : 'negative-value';
  }

  getAbonoCorrecto(): boolean {
    let saldo = (this.eventoSeleccionado - this.getTotalValorPagado());
    if (this.pagoForm.get('valorPago')?.value > saldo) return true;
    else return false;
  }


  borrarPago(pago: PagoI): void {
    Swal.fire({
      title: 'Confirma?',
      text: `Eliminar el pago a nombre ${this.registro?.nomCompleto} del evento.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagoService.delete(pago.idPago).subscribe(resp => {
          this.buscarPagos();
          Swal.fire({
            icon: 'success',
            title: `Ok`,
            text: `El pago de ${this.registro?.nomCompleto} eliminado con éxito.`,
          });
        },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar ...',
              text: 'No se puede eliminar el pago!',
              footer: err.error.mensaje
            });
          });
      }
    });
  }


  public imprimirRecibo(recibo: any) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [80, 150],
      putOnlyUsedFonts: true
    });
    doc.setFont('courier');
    doc.setFontSize(10);
    doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 10, 50);
    doc.addImage('/assets/logo.jpg', 'JPEG', 32, 3, 15, 15);
    let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Iglesia MCI Santa Marta') / 2);
    doc.text('Iglesia MCI Santa Marta', titleXPos, 20);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Nit: 800195397') / 2);
    doc.text('Nit: 800195397', titleXPos, 25);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Calle 15 # 20-17 Barrio Jardin') / 2);
    doc.text('Calle 15 # 20-17 Barrio Jardin', titleXPos, 30);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('3157033591 Tel: 4239150') / 2);
    doc.text('3157033591- 6054239150', titleXPos, 35);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Recibo número: ' + recibo.idPago) / 2);
    doc.text('Recibo #: ' + recibo.idPago, titleXPos, 40);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('fecha y hora del pago:') / 2);
    doc.text('fecha y hora del pago', titleXPos, 45);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(recibo.fechaCreacion) / 2);
    doc.text(recibo.fechaCreacion, titleXPos, 50);
    doc.text('R. G12: ' + recibo.nomUsuario, 10, 55);

    doc.line(5, 60, 75, 60);

    doc.text('Datos del discipulo', 5, 65);
    doc.text('Documento: ' + this.registro.numDocumento, 5, 70);
    doc.text('Nombre: ' + this.registro?.nomCompleto, 5, 75);

    doc.line(5, 80, 75, 80);

    doc.text('Datos del evento', 5, 85);
    doc.text(this.pagoForm.value.idEvento.nomEvento, 5, 90);
    doc.text('Valor pagado: ' + recibo.valorPago, 5, 95);
    doc.text('Medio de pago: ' + recibo.medioPago, 5, 100);
    //doc.text('Saldo pendiente: ', 5, 100);
    doc.line(5, 105, 75, 105);

    doc.text('Genesis: 12:2 Y haré de ti una nación grande, y te bendeciré, y engrandeceré tu nombre, y serás bendición.  Bendeciré a los que te bendijeren, y a los que te maldijeren maldeciré; y serán benditas en ti todas las familias de la tierra', 5, 115);


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



  public descargarReciboPDF(recibo: any) {
    const fileName = "MCI_Recibo_pago_" + recibo.idPago + '.pdf';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [80, 150],
      putOnlyUsedFonts: true
    });
    doc.setFont('courier');
    doc.setFontSize(10);
    doc.addImage('/assets/vertical.jpg', 'JPEG', 0, 5, 10, 50);
    doc.addImage('/assets/logo.jpg', 'JPEG', 32, 3, 15, 15);
    let titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Iglesia MCI Santa Marta') / 2);
    doc.text('Iglesia MCI Santa Marta', titleXPos, 20);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Nit: 800195397') / 2);
    doc.text('Nit: 800195397', titleXPos, 25);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Calle 15 # 20-17 Barrio Jardin') / 2);
    doc.text('Calle 15 # 20-17 Barrio Jardin', titleXPos, 30);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('3157033591 Tel: 4239150') / 2);
    doc.text('3157033591- 6054239150', titleXPos, 35);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('Recibo número: ' + recibo.idPago) / 2);
    doc.text('Recibo #: ' + recibo.idPago, titleXPos, 40);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth('fecha y hora del pago:') / 2);
    doc.text('fecha y hora del pago', titleXPos, 45);
    titleXPos = (doc.internal.pageSize.getWidth() / 2) - (doc.getTextWidth(recibo.fechaCreacion) / 2);
    doc.text(recibo.fechaCreacion, titleXPos, 50);
    doc.text('R. G12: ' + recibo.nomUsuario, 10, 55);
    doc.line(5, 60, 75, 60);
    doc.text('Datos del discipulo', 5, 65);
    doc.text('Documento: ' + this.registro.numDocumento, 5, 70);
    doc.text('Nombre: ' + this.registro?.nomCompleto, 5, 75);
    doc.line(5, 80, 75, 80);
    doc.text('Datos del evento', 5, 85);
    doc.text(this.pagoForm.value.idEvento.nomEvento, 5, 90);
    doc.text('Valor pagado: ' + recibo.valorPago, 5, 95);
    doc.text('Medio de pago: ' + recibo.medioPago, 5, 100);
    //doc.text('Saldo pendiente: ', 5, 100);
    doc.line(5, 105, 75, 105);
    doc.text('Genesis: 12:2 Y haré de ti una nación grande, y te bendeciré, y engrandeceré tu nombre, y serás bendición.  Bendeciré a los que te bendijeren, y a los que te maldijeren maldeciré; y serán benditas en ti todas las familias de la tierra', 5, 115);

    const mensaje = "Iglesia MCI Santa Marta \nFecha y hora del pago " + recibo.fechaCreacion  + ' \nDocumento: ' + this.registro.numDocumento + ' \nA nombre de: ' + this.registro?.nomCompleto + ' \nEvento: '
      + this.pagoForm.value.idEvento.nomEvento + ' \nValor pagado: ' + recibo.valorPago + ' \nMedio de pago: ' + recibo.medioPago
     // + "\nRecibo #: " + recibo.idPago 
      + '\nRecurso. g12: ' + recibo.nomUsuario;
    
    doc.save(fileName);
    
    this.mensajeWhat.phone = "57" + this.registro?.celular.replace(' ', '');
    this.mensajeWhat.message = mensaje;
    this.enviarWhatsApp();

  }


  enviarWhatsApp() {
    if (this.mensajeWhat.phone.length === 12) {
      this.whatsappService.enviarMensaje(this.mensajeWhat).subscribe((resp: any) => {
      });
      (err: any) => { console.error(err); };
    }
  }


}
