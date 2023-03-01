import { Component, Input, OnInit } from '@angular/core';
import { ReporteCelula } from 'src/app/models/reportecelula.model';
import { ReporteCelulaService } from 'src/app/servicios/reportecelula.service';

@Component({
  selector: 'app-temascelula',
  templateUrl: './temascelula.component.html',
  styleUrls: ['./temascelula.component.scss']
})
export class TemascelulaComponent implements OnInit {
  listtema: any; 
  @Input()
  idCelula!: number;

  constructor( private reportecelulaSevicio: ReporteCelulaService) { }

  ngOnInit(): void {
    this.cargarTemas();

  }

  cargarTemas() {
    this.listtema = null;
    this.reportecelulaSevicio.getReporteCelula(this.idCelula)
      .subscribe((tema: ReporteCelula) => {
        this.listtema = tema;
        console.log(tema);
      },
        (err: any) => { console.error(err) }
      );

  }

  eliminarReporteCelula(item: ReporteCelula){}
}
