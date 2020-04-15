import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { MenuServiceService } from 'src/app/services/menuService/menu-service.service';

@Component({
  selector: "app-configuracion-menu-usuarios",
  templateUrl: "./configuracion-menu-usuarios.component.html",
  styleUrls: ["./configuracion-menu-usuarios.component.css"]
})
export class ConfiguracionMenuUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuarioActual: any;
  menu:any;
  //Variables de paginado de usuarios
  paginaActual: number;
  totalUsuarios: number;

  constructor(
    private _usuarioService:UsuarioService,
    private _menuService: MenuServiceService
  ) {}

  ngOnInit() {
    this.obtenerUsuarios(1);
    this.paginaActual = 1;    
  }

  toggleShowSubmenu(modulo, toggle){
    
    if(modulo.submenu && modulo.submenu.length>0){
      modulo.submenu.forEach(submenu => {
        submenu.show = toggle;
      });
    }
    
  }

  obtenerMenuDeUsuario(usuarioId, usuario){
    this._menuService.obtenerMenuDeUsuario(usuarioId).subscribe(
      (resp:any)=>{
        this.menu=resp.menu.menu;
        this.usuarioActual=usuario;
    },
    (error)=>{
      this._menuService.crearMenuDefault(usuarioId).subscribe(
        (resp:any)=>{
          this.menu = resp.menu.menu;
      },
      (error)=>{
        swal(
          "Error al crear menú por defecto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
    });
  }

  actualizarMenu(){
      
      
    this._menuService.actualizarMenu( this.usuarioActual._id , this.menu ).subscribe(
      (resp:any)=>{
        this.menu=resp.menu.menu;
        swal(
          "Configuración Guardada",
          "La configuración de menú ha sido guardada",
          "success"
        );

    },
    (error)=>{
      swal(
        "Error al guardar la configuración de menú",
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });

  }

  paginaAnterior() {
    if (this.paginaActual === 1) {
      return;
    }

    this.paginaActual -= 1;
    this.obtenerUsuarios(this.paginaActual);
  }

  paginaSiguiente() {
    if (this.paginaActual * 10 >= this.totalUsuarios) {
      return;
    }

    this.paginaActual += 1;
    this.obtenerUsuarios(this.paginaActual);
  }

  obtenerUsuarios(pagina: number) {
    let desde = (pagina - 1) * 10;
    this._usuarioService.obtenerUsuarios(desde).subscribe(
      (resp: any) => {
        this.usuarios = resp.usuarios;
        this.totalUsuarios = resp.totalUsuarios;
      },
      error => {
        swal(
          "Error al consultar las compras",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }
}
