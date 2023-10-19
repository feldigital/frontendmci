import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { CelulaService } from 'src/app/servicios/celula.service';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  sales!: any[];
  reporteForm!: FormGroup;
  datareporte: any;
  finicial!: Date;
  ffinal!: Date;
  fechaInicial!: string;
  fechaFinal!: string;
  isLoading: boolean = false;


  constructor(
    private miembroService: MiembroService,
    private reportecelulaSevicio: ReporteCelulaService,
    private celulaService: CelulaService,
    private nuevoService: NuevoService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.crearFormulario();

  }

  crearFormulario() {
    this.reporteForm = this.fb.group
      ({
        reporte: ['0'],
        fechaInicial: [''],
        fechaFinal: [''],

      });
  }

  //excel button click functionality
  exportExcel(nomb: string) {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.datareporte); // Sale Data
      const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Reporte_" + nomb + "_MCI");
      Swal.fire({
        icon: 'success',
        title: `Ok`,
        text: `Su reporte fue exportado en su carpeta de descargas en formato xslx`,
        
      });
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  verReporte() {
    Swal.fire({
      icon: 'info',
      title: `Ok`,
      text: `Reporte en construcción, muy pronto disfrutaras de la información que necesitas`,
      showConfirmButton: false,
      timer: 1500
    });

  }


  generarReporte() {

    const freportData = {
      fechaInicial: this.fechaInicial,
      fechaFinal: this.fechaFinal
    };

    this.finicial = this.reporteForm.get('finicial')?.value;
    this.ffinal = this.reporteForm.get('ffinal')?.value;
    this.isLoading = true;
    this.spinner.show();
    switch (this.reporteForm.get('reporte')?.value) {
      case '0':
        Swal.fire({
          icon: 'info',
          title: `Ok`,
          text: `Seleccione el reporte del que necesite la informacions`,
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
        this.isLoading = false;
        break;

      case '1':
        // insert your code here
        break;

      case '2':
        this.ListarNuevosMinisterio();
        break;
      case '3':
        // insert your code here
        break;
      case '4':
        this.ListarCelulasMinisterio();
        break;
      case '5':
        // insert your code here
        break;
      case '6':
        this.cargarTemas();
        break;
      case '7':
        // insert your code here
        break;
      case '8':
        // insert your code here
        break;
      case '9':
        // insert your code here
        break;
      case '10':
        // insert your code here
        break;
      case '11':
        // insert your code here
        break;
      case '12':
        // insert your code here   
        break;
      case '13':
        // insert your code here
        break;
      case '14':
        this.ListarMiembrosMinisterio();
        break;
      default:
      case '15':
        // insert your code here
        break;
    }

  }
  // llena datos para exportar lo referente a los temas de celula
  cargarTemas() {
    let liderAct = localStorage.getItem("lidersistema");
    this.datareporte = null;
    if (liderAct==='1202'){
    this.reportecelulaSevicio.getTemas()
      .subscribe((resp ) => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Temas");
      },
        (err: any) => { console.error(err) }
      );
    }else{
      this.reportecelulaSevicio.getTemasMinisterio(liderAct)
      .subscribe((resp ) => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Temas");
      },
        (err: any) => { console.error(err) }
      );

    }
  }

  // llena datos para exportar lo referente a los miembros del ministerio
  ListarMiembrosMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    this.datareporte = null;
    this.miembroService.getReporteMinisterio(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Discipulos");
      },
        err => { console.error(err) }
      );
  }

  // llena datos para exportar lo referente a las celulas del ministerio
  ListarCelulasMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    this.datareporte = null;
    if (liderAct==='1202'){
    this.celulaService. getCelulas()
      .subscribe(resp => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Celulas");
      },
        err => { console.error(err) }
      );
    }
    else{
      this.celulaService.getCelulasMinisterioReporte(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Celulas");
      },
        err => { console.error(err) }
      );
    }
  }

  // llena datos para exportar lo referente a los nuevos del ministerio
  ListarNuevosMinisterio() {
    let liderAct = localStorage.getItem("lidersistema");
    this.datareporte = null;
    this.nuevoService.getReportelNuevo(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.spinner.hide();
        this.isLoading = false;
        this.exportExcel("Nuevos");
      },
        err => { console.error(err) }
      );
  }

  onChange(reporteId: Event) {
    console.log("Estoy en cambio" + reporteId); // Aquí iría tu lógica al momento de seleccionar algo
   
    this.reporteForm.get('fechaInicial')?.disable();
    this.reporteForm.get('fechaFinal')?.disable();

  }

}
