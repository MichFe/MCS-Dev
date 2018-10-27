import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";

//Modulos
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';

//Locales
import localeEsMx from "@angular/common/locales/es-MX";
registerLocaleData(localeEsMx, "es-Mx");

//Pipes
import { MesPipe } from "../pipes/mes.pipe";

//Pages
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { ProgressComponent } from "./progress/progress.component";
import { CrmComponent } from './crm/crm.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

//Modals
import { ModalComponent } from './modal/modal.component';
import { InfoClientComponent } from './modal/info-client/info-client.component';
import { CotizacionComponent } from './modal/cotizacion/cotizacion.component';
import { NuevoClienteComponent } from './modal/nuevo-cliente/nuevo-cliente.component';
import { NuevoEventoComponent } from './modal/nuevo-evento/nuevo-evento.component';

//Routes
import { PAGES_ROUTES } from "./pages.routes";
import { InicialesPipe } from "../pipes/iniciales.pipe";

@NgModule({
  imports:[
    CommonModule,
    SharedModule,
    FormsModule,
    PAGES_ROUTES
  ],
  providers:[
    { provide: LOCALE_ID, useValue: 'es-Mx' }
  ],
  declarations: [
    MesPipe,
    InicialesPipe,
    DashboardComponent,
    Graficas1Component,
    ProgressComponent,
    PagesComponent,
    CrmComponent,
    ModalComponent,
    InfoClientComponent,
    NuevoClienteComponent,
    CotizacionComponent,
    CalendarioComponent,
    NuevoEventoComponent,
    UsuariosComponent
  ],
  exports: [
    DashboardComponent,
    Graficas1Component,
    ProgressComponent,
    PagesComponent
  ]
})
export class PagesModule {}