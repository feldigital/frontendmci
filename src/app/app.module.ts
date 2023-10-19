import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localePY from '@angular/common/locales/es';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";


import { InicioComponent } from './pages/inicio/inicio.component';
import { HelpComponent } from './pages/help/help.component';
import { MiembroComponent } from './pages/miembro/miembro.component';
import { MinisterioComponent } from './pages/ministerio/ministerio.component';
import { ListcelulaComponent } from './pages/listcelula/listcelula.component';
import { CelulaComponent } from './pages/celula/celula.component';
import { CelulanuevaComponent } from './pages/celulanueva/celulanueva.component';
import { ListasistenteComponent } from './pages/listasistente/listasistente.component';
import { DetallediscipuloComponent } from './pages/detallediscipulo/detallediscipulo.component';
import { NovedadcelulaComponent } from './pages/novedadcelula/novedadcelula.component';
import { CelulareporteComponent } from './pages/celulareporte/celulareporte.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';
import { ConsolidaruvidaComponent } from './pages/consolidaruvida/consolidaruvida.component';

import { MiembroService } from './servicios/miembro.service';
import { CelulaService } from './servicios/celula.service';
import { MiembroCelulaService } from './servicios/miembrocelula.service';
import { ReporteCelulaService } from './servicios/reportecelula.service';
import { AsistenciaCelulaService } from './servicios/asistenciacelula.service';
import { ConsolidarUvidaService } from './servicios/consolidaruvida.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
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
import { ReinicioComponent } from './pages/reinicio/reinicio.component';
import { ArbolComponent } from './pages/arbol/arbol.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MatTabsModule} from  '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GestionuvidaComponent } from './pages/gestionuvida/gestionuvida.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ConfiguracionesComponent } from './pages/configuraciones/configuraciones.component';
import { AsistenciauvidaComponent } from './pages/asistenciauvida/asistenciauvida.component';
import { TemascelulaComponent } from './pages/temascelula/temascelula.component';


//import { JwtInterceptorInterceptor } from './jwt-interceptor.interceptor';


registerLocaleData(localePY, 'es');




@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HelpComponent,
    MiembroComponent,
    MinisterioComponent,
    ListcelulaComponent,
    CelulaComponent,
    CelulanuevaComponent,
    ListasistenteComponent,
    DetallediscipuloComponent,
    NovedadcelulaComponent,
    CelulareporteComponent,
    NuevoComponent,
    LoginComponent,
    ReporteComponent,
    SeguimientonuevosComponent,
    GestionnuevoComponent,
    GestionarofrendaComponent,
    ReinicioComponent,
    ArbolComponent,
    ConsolidaruvidaComponent,
    GestionuvidaComponent,
    PerfilComponent,
    ConfiguracionesComponent,
    AsistenciauvidaComponent,
    TemascelulaComponent,
   
  ],
  imports: [

   
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    MatSlideToggleModule,  

  ],

  providers: [
    MiembroService,
    CelulaService,
    MiembroCelulaService,
    ReporteCelulaService,
    NuevoService,
    AsistenciaCelulaService,
    ConsolidarUvidaService,
    //JwtInterceptorInterceptor,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'es' },
    { provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
