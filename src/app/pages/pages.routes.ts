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
            { path: '', redirectTo: '/reporteVentas', pathMatch: 'full' },
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);