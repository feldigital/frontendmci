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
import { ReinicioComponent } from './pages/reinicio/reinicio.component';
//import { UserGuardGuard } from './guards/user-guard.guard';
import { LoginGuard } from './guards/login.guard';




const routes: Routes = [
  {
    path: '',    pathMatch: 'full',    redirectTo: 'inicio',  },
  { path: 'inicio', component: InicioComponent},//, canActivate: [LoginGuard]},
  { path: 'ministerio', component: MinisterioComponent},// canActivate: [LoginGuard]},
  { path: 'miembro/:id', component: MiembroComponent},// canActivate: [LoginGuard]},
  { path: 'listcelula', component: ListcelulaComponent},// canActivate: [LoginGuard]},
  { path: 'celulanueva/:id', component: CelulanuevaComponent},// canActivate: [LoginGuard]},
  { path: 'celulanueva', component: CelulanuevaComponent},// canActivate: [LoginGuard]},
  { path: 'miembro', component: MiembroComponent},// canActivate: [LoginGuard]},
  { path: 'nuevo', component: NuevoComponent},// canActivate: [LoginGuard]},
  { path: 'help', component: HelpComponent},// canActivate: [LoginGuard]},
  { path: 'celula/:id', component: CelulaComponent},// canActivate: [LoginGuard]},
  { path: 'detalle/:id', component: DetallediscipuloComponent},// canActivate: [LoginGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'reporte', component: ReporteComponent},// canActivate: [LoginGuard]},
  { path: 'seguimiento', component: SeguimientonuevosComponent},// canActivate: [LoginGuard] },
  { path: 'gestionn/:id', component: GestionnuevoComponent},// canActivate: [LoginGuard]},
  { path: 'gestiono', component: GestionarofrendaComponent},// canActivate: [LoginGuard]},
  { path: 'celulareporte/:id', component: CelulareporteComponent},// canActivate: [LoginGuard]},
  { path: 'reinicio', component: ReinicioComponent},// canActivate: [LoginGuard]},  
  { path: '**', component: InicioComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
