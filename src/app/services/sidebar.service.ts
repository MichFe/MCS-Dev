import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class SidebarService {
  menu: any = [
    {
      modulo: "Ventas",
      icono: "mdi mdi-cash-usd",
      submenu: [
        { titulo: "CRM", url: "/crm" },
        { titulo: "Reporte de Ventas", url: "/reporteVentas" },
        { titulo: "Catálogo de Productos", url: "/catalogoProductos" }
      ]
    }
  ];

  constructor() {}
}
