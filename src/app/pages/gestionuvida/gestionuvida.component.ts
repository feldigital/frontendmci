import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { ConsolidarUvidaService } from 'src/app/servicios/consolidaruvida.service';
import Swal from 'sweetalert2';
import { PostuladosService } from 'src/app/servicios/postulados.service';
import { Chart, registerables } from 'chart.js';
import jsPDF, { CellConfig } from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-gestionuvida',
  templateUrl: './gestionuvida.component.html',
  styleUrls: ['./gestionuvida.component.scss']
})
export class GestionuvidaComponent implements OnInit, AfterViewInit {

  isLoading: boolean = true;
  listciclos: any;
  fechaCiclo!:Date;
  fechaCicloEstado!:Date;
  fechaActual!: Date;
  datos:any;
  postuladoUvida: any;
  filterPostulados: [] | any;
  selectedCardIndex: number | null = null;
  cicloActivo!:String;
  
  
   
  _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filterPostulados = this.listFilter ? this.performFilter(this.listFilter) : this.postuladoUvida;
  }


  @ViewChild('myChart', { static: true })
  myChart!: ElementRef;

  xValues: string[] = []; 
   yValues: number[] = [];


  barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#1e7145"
  ];

  constructor(
    private consolidaruvidaServicio: ConsolidarUvidaService,
    private spinner: NgxSpinnerService,  
    private postuladoServicio: PostuladosService

  ) {
    this.spinner.show();
    this.fechaActual = new Date() ;

  
  }
 

  performFilter(filterBy: string): any[] {
    if (filterBy === '' || filterBy.length < 3) return this.postuladoUvida
    filterBy = filterBy.toLocaleLowerCase();
    return this.postuladoUvida.filter((postu: any) => postu.nomCompleto.toLocaleLowerCase().indexOf(filterBy) !== -1
      || postu.nomCompletoLiderInmediato.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }


  ngOnInit(): void {
    Chart.register(...registerables);
    this.cargarCiclos();

  }
 

  ngAfterViewInit(): void {  
  }

  chartInit12() {
    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.xValues,
        datasets: [{
          backgroundColor: this.barColors,
          data: this.yValues
        }]
      },
      options: {

      } // Remove the title property here
    });
  }

  cargarCiclos() {
    this.listciclos = null;
    this.consolidaruvidaServicio.getCiclosActivos()
      .subscribe((ciclos: ConsolidarUvidaI) => {
        this.listciclos = ciclos;
        this.datosGrafico();
        this.spinner.hide();
        this.isLoading = false;
      },
        (err: any) => { console.error(err) }
      );
  }

  datosGrafico() {
    this.datos = []; // Inicializar la matriz aquí
    this.xValues = [];
    this.yValues = [];
    for (let ciclo of this.listciclos) {
      this.xValues.push(ciclo.cicloUvida);
      this.yValues.push(ciclo.postulados.length);

      for (let postulado of ciclo.postulados) {
        this.datos.push(postulado);
      }
    }
    this.chartInit12() 
         
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

    this.postuladoServicio.despostular(item.idPostulado).subscribe(resp => {
      this.postuladoUvida = this.postuladoUvida.filter((cli: any) => cli !== item);
      this.cargarCiclos();
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

mostrar() : boolean {
  if(this.fechaCiclo >= this.fechaActual)
    return true;
  else 
  return false; 

}

estadosCiclo(item:any) : boolean {
  this.fechaCicloEstado=new Date(item.fechaEncuentro);
  if(this.fechaCicloEstado >= this.fechaActual)
    return true;
  else 
  return false; 

}

mostrarPostulados(item: any): void { 
  this.postuladoUvida=item.postulados;  
  this.fechaCiclo=new Date(item.fechaEncuentro);
    this.cicloActivo=item.cicloUvida;
  this.fechaCiclo.setDate(this.fechaCiclo.getDate() + 5);
  this.postuladoUvida.sort((a: any, b:any) => a.nomCompleto.localeCompare(b.nomCompleto)); 
  this.filterPostulados=this.postuladoUvida;
 
}

cadenaCorta(cadena: String): String{
  if (cadena)  return  cadena.substring(0,100); else return "";
}

  ocultarPostulados(): void {
    this.postuladoUvida = [];   
  this.selectedCardIndex = null;
  }

  // Función para generar el PDF desde un elemento HTML
  generatePDF(): void { 
    const fileName = "MCI_" + this.cicloActivo.replace(' ', '_') + '_' + Math.floor((Math.random() * 1000000) + 1) + '.pdf';
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'letter',
      putOnlyUsedFonts: true
    });  
    autoTable(doc, { html: '#elementId' })       
    doc.save(fileName)
  }
  
  pagina(){}

}


