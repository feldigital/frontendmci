import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MiembroService } from './servicios/miembro.service';
import { MiembroI } from './models/miembro.model';
import { MatMenuModule } from '@angular/material/menu';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  lider: any;
  logueado!: boolean;
 //liderAct: any;
 

  constructor(private observer: BreakpointObserver, private router: Router, private miembroService: MiembroService) {
    this.logueado = false;   
    this.buscarlideract();
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  buscarlideract() {
    if (localStorage.getItem("lidersistema")) {
      let liderAct = localStorage.getItem("lidersistema");
      this.lider = null;      
      this.miembroService.getMiembro(liderAct)
        .subscribe((resp: MiembroI) => {
          this.lider = resp;
          this.logueado = true;
          console.log(this.logueado);
          (err: any) => { console.error(err) }
        });
    }
  }

  cerrar() {
    //console.log("ya llegue");
    localStorage.clear();
    localStorage.removeItem("lidersistema");
    localStorage.removeItem("nombsistema");
    this.logueado = false;
    this.router.navigate(['/login']);
  }
  abrir() {
    this.router.navigate(['/login']);
  }
  nombreUsuario() :string{
   let caracteres=  this.lider.nomCompleto.indexOf(' ')
   if (caracteres>0) return this.lider.nomCompleto.substring(0,caracteres) 
   else return this.lider.nomCompleto
  }

}
