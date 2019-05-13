import { Injectable } from '@angular/core';
import { RequisicionesService } from './requisiciones/requisiciones.service';

@Injectable({
  providedIn: "root"
})
export class SidebarService {

  //Menu
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
    },
    {
      modulo: "Compras",
      icono: "mdi mdi-tag-text-outline",
      url:"/requisiciones",
      submenu:[
        { titulo: "Requisiciones", url: "/requisiciones" },
        { titulo: "Aprobaciones", url: "/aprobaciones" },
        { titulo: "Compras", url:"/compras" },
        { titulo: "Cuentas por pagar", url: "/cuentasPorPagar"}
      ]
    },
    {
      modulo: "Gastos",
      icono: "ti-wallet",
      url:"/gastos",
      submenu:[
        { titulo: "Registro de gastos", url: "/gastos" },
        { titulo: "Reporte de gastos", url: "/reporteDeGastos"}
      ]
    },
    {
      modulo: "Equipo",
      icono: "mdi mdi-account-multiple",
      url:"/permisosDeUsuario",
      submenu: [
        { titulo: "Permisos", url: "/permisosDeUsuario" },
        { titulo: "Nomina", url: "/nomina" }
      ]
    }
  ];

  constructor( 
    private _requisicionesService:RequisicionesService
   ) {}

  obtenerTotalRequisicionesPorAprobar(){

    this._requisicionesService.obtenerRequisicionesPorAprobar(1)
      .subscribe(
        (resp: any) => {
          this.menu.forEach(menu => {
            if (menu.modulo == 'Compras') {
              menu.submenu.forEach(submenu => {
                if (submenu.titulo == 'Aprobaciones') {
                  submenu.notificacion = resp.totalReqisiciones;
                }
              });
            }
          });
        });

  }

  
}
