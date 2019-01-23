import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";

//Modulos
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { PipesModule } from "../pipes/pipes.module";

//Locales
import localeEsMx from "@angular/common/locales/es-MX";
registerLocaleData(localeEsMx, "es-Mx");

//Pages
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { ProgressComponent } from "./progress/progress.component";
import { CrmComponent } from './crm/crm.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CatalogoProductosComponent } from './catalogo-productos/catalogo-productos.component';
import { ProfileComponent } from './profile/profile.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ElementoVentasComponent } from './reporte-ventas/elemento-ventas/elemento-ventas.component';
import { ElementoCuentasCobrarComponent } from './reporte-ventas/elemento-cuentas-cobrar/elemento-cuentas-cobrar.component';

//Modals
import { ModalComponent } from './modal/modal.component';
import { InfoClientComponent } from './modal/info-client/info-client.component';
import { CotizacionComponent } from './modal/cotizacion/cotizacion.component';
import { NuevoClienteComponent } from './modal/nuevo-cliente/nuevo-cliente.component';
import { NuevoEventoComponent } from './modal/nuevo-evento/nuevo-evento.component';
import { ImageUploadComponent } from './modal/image-upload/image-upload.component';
import { AgregarProductoComponent } from './modal/agregarProducto/agregar-producto/agregar-producto.component';
import { TicketComponent } from './modal/ticket/ticket.component';
import { EditarProductoComponent } from './modal/editar-producto/editar-producto.component';
import { DescripcionProductoComponent } from './modal/descripcion-producto/descripcion-producto.component';

//Routes
import { PAGES_ROUTES } from "./pages.routes";

//Directivas
import { InfiniteScrollDirective } from "../directives/infinite-scroll/infinite-scroll.directive";
import { CuentasPorCobrarComponent } from './cuentas-por-cobrar/cuentas-por-cobrar.component';
import { ImageDisplayModalComponent } from './modal/image-display-modal/image-display-modal.component';



@NgModule({
  imports:[
    CommonModule,
    SharedModule,
    FormsModule,
    PAGES_ROUTES,
    PipesModule
  ],
  providers:[
    { provide: LOCALE_ID, useValue: 'es-Mx' }
  ],
  declarations: [
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
    UsuariosComponent,
    InfiniteScrollDirective,
    CatalogoProductosComponent,
    ProfileComponent,
    ImageUploadComponent,
    AgregarProductoComponent,
    TicketComponent,
    EditarProductoComponent,
    DescripcionProductoComponent,
    ReporteVentasComponent,
    ElementoVentasComponent,
    ElementoCuentasCobrarComponent,
    CuentasPorCobrarComponent,
    ImageDisplayModalComponent
  ],
  exports: [
    DashboardComponent,
    Graficas1Component,
    ProgressComponent,
    PagesComponent
  ]
})
export class PagesModule {}