import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePY from '@angular/common/locales/es';
import { HttpClientModule } from '@angular/common/http';


import { InicioComponent } from './pages/inicio/inicio.component';
import { HelpComponent } from './pages/help/help.component';
import { MiembroComponent } from './pages/miembro/miembro.component';
import { TemascelulaComponent } from './pages/celulareporte/temascelula/temascelula.component';
import { MinisterioComponent } from './pages/ministerio/ministerio.component';
import { ListcelulaComponent } from './pages/listcelula/listcelula.component';
import { CelulaComponent } from './pages/celula/celula.component';
import { CelulanuevaComponent } from './pages/celulanueva/celulanueva.component';
import { ListasistenteComponent } from './pages/listasistente/listasistente.component';
import { DetallediscipuloComponent } from './pages/detallediscipulo/detallediscipulo.component';
import { NovedadcelulaComponent } from './pages/novedadcelula/novedadcelula.component';
import { CelulareporteComponent } from './pages/celulareporte/celulareporte.component';
import { AsistenciaComponent } from './pages/celulareporte/asistencia/asistencia.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';



import { MiembroService } from './servicios/miembro.service';
import { CelulaService } from './servicios/celula.service';
import { MiembroCelulaService } from './servicios/miembrocelula.service';
import { ReporteCelulaService } from './servicios/reportecelula.service';
import { AsistenciaCelulaService } from './servicios/asistenciacelula.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NuevoService } from './servicios/nuevo.service';
import { LoginComponent } from './pages/login/login.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { SeguimientonuevosComponent } from './pages/seguimientonuevos/seguimientonuevos.component';
import { GestionnuevoComponent } from './pages/gestionnuevo/gestionnuevo.component';
import { GestionarofrendaComponent } from './pages/gestionarofrenda/gestionarofrenda.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


registerLocaleData(localePY, 'es');




@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HelpComponent,
    MiembroComponent,
    TemascelulaComponent,
    MinisterioComponent,
    ListcelulaComponent,
    CelulaComponent,
    CelulanuevaComponent,
    ListasistenteComponent,
    DetallediscipuloComponent,
    NovedadcelulaComponent,
    CelulareporteComponent,
    AsistenciaComponent,
    NuevoComponent,
    LoginComponent,
    ReporteComponent,
    SeguimientonuevosComponent,
    GestionnuevoComponent,
    GestionarofrendaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  //  FontAwesomeModule,


  ],

  providers: [
    MiembroService,
    CelulaService,
    MiembroCelulaService,
    ReporteCelulaService,
    NuevoService,
    AsistenciaCelulaService,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'es' }
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
