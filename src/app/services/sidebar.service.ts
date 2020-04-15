import { Injectable } from '@angular/core';
import { RequisicionesService } from './requisiciones/requisiciones.service';
import { MenuServiceService } from './menuService/menu-service.service';
import { UsuarioService } from './usuarios/usuario.service';

declare function activeLiSideBar();

@Injectable({
  providedIn: "root"
})
export class SidebarService {
  //Menu
  menu: any = [
    {
      modulo: "Vender",
      icono: "mdi mdi-cart",
      url: "/catalogoProductos",
      show: false
    },
    {
      modulo: "Ventas",
      icono: "mdi mdi-cash-usd",
      url: "/reporteVentas",
      show: false,
      submenu: [
        { titulo: "CRM", url: "/crm", show: false },
        { titulo: "Reporte de Ventas", url: "/reporteVentas", show: false },
        { titulo: "Catálogo de Productos", url: "/catalogoProductos", show: false },
        { titulo: "Cuentas por cobrar", url: "/cuentasPorCobrar", show: false }
      ]
    },
    {
      modulo: "Compras",
      icono: "mdi mdi-tag-text-outline",
      url: "/requisiciones",
      show: false,
      submenu: [
        { titulo: "Requisiciones", url: "/requisiciones", show: false },
        { titulo: "Aprobaciones", url: "/aprobaciones", show: false },
        { titulo: "Compras", url: "/compras", show: false },
        { titulo: "Cuentas por pagar", url: "/cuentasPorPagar", show: false }
      ]
    },
    {
      modulo: "Gastos",
      icono: "ti-wallet",
      url: "/gastos",
      show: false,
      submenu: [
        { titulo: "Registro de gastos", url: "/gastos", show: false },
        { titulo: "Reporte de gastos", url: "/reporteDeGastos", show: false }
      ]
    },
    {
      modulo: "Inventario",
      icono: "mdi mdi-package-variant-closed",
      url: "/inventarioTienda",
      show: false,
      submenu: [
        { titulo: "Inventario tienda", url: "/inventarioTienda", show: false }
      ]

    },
    {
      modulo: "Equipo",
      icono: "mdi mdi-account-multiple",
      url: "/nomina",
      show: false,
      submenu: [
        { titulo: "Nomina", url: "/nomina", show: false },
        { titulo: "Usuarios", url: "/usuarios", show: false}
      ]
    },
    {
      modulo: "Configuración",
      icono: "mdi mdi-settings",
      url: "/permisosDeUsuario",
      show: false,
      submenu: [
        { titulo: "Permisos", url: "/permisosDeUsuario", show: false },
        { titulo: "Configuración de menú", url: "/configuracionDeMenu", show: false }
      ]
    }
  ]; 
  
  constructor(
    private _requisicionesService: RequisicionesService,
    private _menuService: MenuServiceService,
    private _usuarioService: UsuarioService
    ) {
        }

  obtenerMenuDeUsuario(){
    this._menuService.obtenerMenuDeUsuario(this._usuarioService.id).subscribe(
      (resp:any)=>{
        this.menu = resp.menu.menu;
        activeLiSideBar();
       
        
    },(error)=>{
      this.crearMenuDefault();
    });
  }

 crearMenuDefault(){
    this._menuService.crearMenuDefault(this._usuarioService.id).subscribe(
      (resp:any)=>{
        this.menu=resp.menu.menu;
    });
  }

  obtenerTotalRequisicionesPorAprobar() {
    this._requisicionesService
      .obtenerRequisicionesPorAprobar(1)
      .subscribe((resp: any) => {
        this.menu.forEach(menu => {
          if (menu.modulo == "Compras") {
            menu.submenu.forEach(submenu => {
              if (submenu.titulo == "Aprobaciones") {
                submenu.notificacion = resp.totalReqisiciones;
              }
            });
          }
        });
      });
  }
}
