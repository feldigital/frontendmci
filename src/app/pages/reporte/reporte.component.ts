import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { CelulaService } from 'src/app/servicios/celula.service';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { NuevoService } from 'src/app/servicios/nuevo.service';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';
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
  finicial!:Date;
  ffinal!: Date;


  constructor(
    private miembroService: MiembroService,
    private reportecelulaSevicio: ReporteCelulaService,
    private celulaService: CelulaService,
    private nuevoService: NuevoService,
    private fb: FormBuilder) { }

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
  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.datareporte); // Sale Data
      const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "MCI");
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
        fileName + "_Reporte_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  verReporte(){
    Swal.fire({
      icon: 'info',
      title: `Ok`,
      text: `Reporte en construcción, muy pronto disfrutaras de la información que necesitas`,
      showConfirmButton: false,
      timer: 1500
    });

  }


  generarReporte() {
    this.finicial= this.reporteForm.get('finicial')?.value;
    this.ffinal= this.reporteForm.get('ffinal')?.value;
    switch (this.reporteForm.get('reporte')?.value) {
      case '0':
        Swal.fire({
          icon: 'info',
          title: `Ok`,
          text: `Reporte en construcción, muy pronto disfrutaras de la información que necesitas`,
          showConfirmButton: false,
          timer: 1500
        });
        break;

      case '1':
        // insert your code here
        break;

      case '2':
        // insert your code here
        break;
      case '3':
        this.ListarNuevosMinisterio(); 
        break;
      case '4':
        // insert your code here
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
        this.ListarCelulasMinisterio();
        break;
      case '10':

        break;
      case '11':

        break;
      case '12':
      
        break;
      case '13':

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
    let liderAct = sessionStorage.getItem("lidersistema");
    this.datareporte = null;
    this.reportecelulaSevicio.getOfrendaCelula()
      .subscribe((resp: ReporteCelula) => {
        this.datareporte = resp;
        this.exportExcel();
      },
        (err: any) => { console.error(err) }
      );
  }

  // llena datos para exportar lo referente a los miembros del ministerio
  ListarMiembrosMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.datareporte = null;
    this.miembroService.getMiembrosMinisterio(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.exportExcel();
      },
        err => { console.error(err) }
      );
  }

  // llena datos para exportar lo referente a las celulas del ministerio
  ListarCelulasMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.datareporte = null;
    this.celulaService.getCelulasMinisterioReporte(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.exportExcel();
      },
        err => { console.error(err) }
      );
  }

  // llena datos para exportar lo referente a los nuevos del ministerio
  ListarNuevosMinisterio() {
    let liderAct = sessionStorage.getItem("lidersistema");
    this.datareporte = null;
    this.nuevoService.getNuevosMinisterio(liderAct)
      .subscribe(resp => {
        this.datareporte = resp;
        this.exportExcel();
      },
        err => { console.error(err) }
      );
  }

}
