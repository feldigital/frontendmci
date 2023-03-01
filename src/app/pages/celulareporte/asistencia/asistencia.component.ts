import { Component, Input, OnInit } from '@angular/core';
import { MiembroCelula } from 'src/app/models/miembrocelula.model';
import { CelulaService } from 'src/app/servicios/celula.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit {
  discipuloscelula: any;
   @Input()
  idCelula!: number;

  constructor( private celulaServicio: CelulaService) { }

  ngOnInit(): void {
  }

  
  cargarDiscipulos() {
    this.discipuloscelula = null;
    this.celulaServicio.getCelulaDiscipulos(this.idCelula)
      .subscribe((disc: MiembroCelula) => {
        this.discipuloscelula = disc;
       },
        (err: any) => { console.error(err) }
      );
  }

  reportar(){}
}
