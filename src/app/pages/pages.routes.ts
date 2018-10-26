import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { CrmComponent } from "./crm/crm.component";
import { CalendarioComponent } from "./calendario/calendario.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { LoginGuardGuard } from "../services/guards/login-guard.guard";


const pagesRoutes:Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'progress', component: ProgressComponent },
            { path: 'graficas1', component: Graficas1Component },
            { path: 'crm', component: CrmComponent },
            { path: 'calendario', component: CalendarioComponent },
            { path: 'colaboradores', component: UsuariosComponent },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);