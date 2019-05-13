import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { CrmComponent } from "./crm/crm.component";
import { CalendarioComponent } from "./calendario/calendario.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { LoginGuardGuard } from "../services/guards/login-guard.guard";
import { CatalogoProductosComponent } from "./catalogo-productos/catalogo-productos.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReporteVentasComponent } from "./reporte-ventas/reporte-ventas.component";
import { CuentasPorCobrarComponent } from "./cuentas-por-cobrar/cuentas-por-cobrar.component";
import { RequisicionesComponent } from "./requisiciones/requisiciones.component";
import { ComprasComponent } from "./compras/compras.component";
import { AprobacionRequisicionesComponent } from "./aprobacion-requisiciones/aprobacion-requisiciones.component";
import { CuentasPorPagarComponent } from "./cuentas-por-pagar/cuentas-por-pagar.component";
import { PermisosDeUsuariosComponent } from "./permisos-de-usuarios/permisos-de-usuarios.component";
import { RegistroGastosComponent } from "./registro-gastos/registro-gastos.component";
import { NominaComponent } from "./nomina/nomina.component";
import { ReporteGastosComponent } from "./reporte-gastos/reporte-gastos.component";


const pagesRoutes:Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'progress', component: ProgressComponent },
            { path: 'catalogoProductos', component: CatalogoProductosComponent},
            { path: 'graficas1', component: Graficas1Component },
            { path: 'crm', component: CrmComponent },
            { path: 'calendario', component: CalendarioComponent },
            { path: 'colaboradores', component: UsuariosComponent },
            { path: 'perfil', component: ProfileComponent},
            { path: 'reporteVentas', component: ReporteVentasComponent },
            { path: 'cuentasPorCobrar', component: CuentasPorCobrarComponent },
            { path: 'requisiciones', component: RequisicionesComponent },
            { path: 'compras', component: ComprasComponent},
            { path: 'aprobaciones', component: AprobacionRequisicionesComponent },
            { path: 'cuentasPorPagar', component: CuentasPorPagarComponent },
            { path: 'permisosDeUsuario', component: PermisosDeUsuariosComponent },
            { path: 'gastos', component: RegistroGastosComponent },
            { path: 'nomina', component: NominaComponent },
            { path: 'reporteDeGastos', component: ReporteGastosComponent},
            { path: '', redirectTo: '/reporteVentas', pathMatch: 'full' }
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);