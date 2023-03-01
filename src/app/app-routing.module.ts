import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './pages/help/help.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CelulaComponent } from './pages/celula/celula.component';
import { MinisterioComponent } from './pages/ministerio/ministerio.component';
import { MiembroComponent } from './pages/miembro/miembro.component';
import { ListcelulaComponent } from './pages/listcelula/listcelula.component';
import { CelulanuevaComponent } from './pages/celulanueva/celulanueva.component';
import { DetallediscipuloComponent } from './pages/detallediscipulo/detallediscipulo.component';
import { LoginComponent } from './pages/login/login.component';
import { CelulareporteComponent } from './pages/celulareporte/celulareporte.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { SeguimientonuevosComponent } from './pages/seguimientonuevos/seguimientonuevos.component';
import { GestionnuevoComponent } from './pages/gestionnuevo/gestionnuevo.component';
import { GestionarofrendaComponent } from './pages/gestionarofrenda/gestionarofrenda.component';




const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio',
  },
  { path: 'inicio', component: InicioComponent },
  { path: 'ministerio', component: MinisterioComponent },
  { path: 'miembro/:id', component: MiembroComponent },
  { path: 'listcelula', component: ListcelulaComponent },
  { path: 'celulanueva/:id', component: CelulanuevaComponent },
  { path: 'celulanueva', component: CelulanuevaComponent },
  { path: 'miembro', component: MiembroComponent },
  { path: 'nuevo', component: NuevoComponent },
  { path: 'help', component: HelpComponent },
  { path: 'celula/:id', component: CelulaComponent },
  { path: 'detalle/:id', component: DetallediscipuloComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'seguimiento', component: SeguimientonuevosComponent },
  { path: 'gestionn/:id', component: GestionnuevoComponent },
  { path: 'gestiono', component: GestionarofrendaComponent },
  { path: 'celulareporte/:id', component: CelulareporteComponent },
  
  { path: '**', component: InicioComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
