import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { PermisosService } from 'src/app/services/permisos/permisos.service';
import swal from 'sweetalert';

@Component({
  selector: "app-permisos-de-usuarios",
  templateUrl: "./permisos-de-usuarios.component.html",
  styleUrls: ["./permisos-de-usuarios.component.css"]
})
export class PermisosDeUsuariosComponent implements OnInit {
  //Data
  usuarios: any[] = [];
  usuarioActual: any;

  permisos: any;

  totalUsuarios: number;
  paginaActual: number;

  constructor(
    private _usuarioService: UsuarioService,
    private _permisosService: PermisosService
  ) {}

  ngOnInit() {
    this.obtenerUsuarios(1);
    this.paginaActual = 1;
  }

  obtenerPermisos( user ) {
    this.usuarioActual = user;
    let userId = user._id;

    this._permisosService.obtenerPermisos(userId).subscribe(
      (resp:any) => {
        this.permisos=resp.permisos;
      },
      (error) => {
        //Si no hay permisos, creamos permisos por defecto
        if ( error.error.mensaje === "No hay permisos registrados" ) {
          this.crearPermisos(userId);
        } else {
          //Si ocurre un error mostramos el mensaje
          swal(
            "Error al consultar permisos",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      }
    );
  }

  crearPermisos(userId) {
    this._permisosService.crearPermisos({ usuario: userId }).subscribe(
      (resp:any) => {
        
        this.permisos = resp.permisos;
        
        swal(
          "Permisos Creados exitosamente",
          `Se han creado los permisos por defecto para: ${
            resp.permisos.usuario.nombre
          }`,
          "success"
        );
      },
      error => {
        swal(
          "Error al crear permisos",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  actualizarPermisos() {
    let permisos:any = this.permisos;
    permisos.usuario = this.usuarioActual._id;    

    this._permisosService.actualizarPermisos(permisos).subscribe(
      (resp:any) => {
        
        this.obtenerPermisos(this.usuarioActual);
        
        swal(
          "Permisos actualizados correctamente",
          `Se han actualizado correctamente los permisos de: ${ resp.permisos.usuario.nombre }`,
          "success"
        );
      },
      error => {
        swal(
          "Error al actualizar permisos",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  eliminarPermisos(userId) {
    this._permisosService.eliminarPermisos(userId).subscribe(
      (resp) => {},
      (error) => {
        swal(
          "Error al eliminar permisos",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
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
}
