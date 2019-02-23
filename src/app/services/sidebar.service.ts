import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class SidebarService {
  menu: any = [
    {
      modulo: "Vender",
      icono: "mdi mdi-cart",
      url: "/catalogoProductos"
    },
    {
      modulo: "Ventas",
      icono: "mdi mdi-cash-usd",
      url:"/reporteVentas",
      submenu: [
        { titulo: "CRM", url: "/crm" },
        { titulo: "Reporte de Ventas", url: "/reporteVentas" },
        { titulo: "Catálogo de Productos", url: "/catalogoProductos" },
        { titulo: "Cuentas por cobrar", url: "/cuentasPorCobrar" }
      ]
    }
  ];

  constructor() {}
}
