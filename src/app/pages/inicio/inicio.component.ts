
import { AfterViewInit, Component,  Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})

export class InicioComponent implements OnInit { //AfterViewInit

 // data: any[];
  lider: any;
  ministerio12!: any;
  ministerio144!: any;
  logueado!: boolean;
  liderAct: any;
  chartDonnus: any;
  @Input() idChart = '1';
  @Input() idChartO = '2';  


  constructor(private miembroService: MiembroService,
    @Inject(DOCUMENT) private document: Document ) {      
        
  }

  selectedNode: any;
  nodeUpdated(node: any) {
  }
  nodeSelected(node: any) {
    this.selectedNode = node;
  }
  
  ngOnInit(): void {

    Chart.register(...registerables);
    this.logueado = false;
    this.liderAct = null;
    this.buscarlideract();
    this.cargarMinisterio12();
    this.cargarMinisterio144();
  }

  // ngAfterViewInit(): void {
  // this.chartInit12();
  //this.chartInit144();// }


  chartInit12() {
    const el: any = this.document.getElementById(this.idChart);
    const ctx = el.getContext('2d');
    this.chartDonnus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.ministerio12?.length, 12 - this.ministerio12?.length],
          backgroundColor: [
            '#ffa5a5',
            '#2bb6d7',
          ],
          borderWidth: 0,
          rotation: 180
        }]
      }
    });
  }
  chartInit144() {
    const el: any = this.document.getElementById(this.idChartO);
    const ctx = el.getContext('2d');
    this.chartDonnus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.ministerio144?.length, 144 - this.ministerio144?.length],
          backgroundColor: [
            '#a5a5ff',
            '#C5E7D7',
          ],
          borderWidth: 0,
          rotation: 180
        }]
      }
    });
  }


  buscarlideract() {
    if (sessionStorage.getItem("lidersistema")) {
      this.liderAct = sessionStorage.getItem("lidersistema");
      this.lider = null;
      this.miembroService.getMiembro(this.liderAct)
        .subscribe((resp: MiembroI) => {
          this.lider = resp;
          this.logueado = true;
          (err: any) => { console.error(err) }
        });
    }
  }
  cargarMinisterio12() {
    // console.log(this.liderAct);
    this.miembroService.getMinisterio12(this.liderAct)
      .subscribe(resp => {
        this.ministerio12 = resp;
        this.chartInit12();
      },
        err => { console.error(err) }
      );
  }

  cargarMinisterio144() {
    this.miembroService.getMinisterio144(this.liderAct)
      .subscribe(resp => {
        this.ministerio144 = resp;
        this.chartInit144();
      },
        err => { console.error(err) }
      );
  }

}