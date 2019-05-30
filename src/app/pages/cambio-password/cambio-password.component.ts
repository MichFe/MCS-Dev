import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import swal from 'sweetalert';

@Component({
  selector: "app-cambio-password",
  templateUrl: "./cambio-password.component.html",
  styleUrls: ["./cambio-password.component.css"]
})
export class CambioPasswordComponent implements OnInit {
  password: string;
  passwordConfirm: string;

  //Data
  usuarioSolicitante:any;
  usuarioActual: any;
  usuarios: any[] = [];

  constructor(
    private _usuarioService: UsuarioService
    ) {
    }

  ngOnInit() {
    
    this.usuarioSolicitante = this._usuarioService.usuario;
    this.usuarioActual=this.usuarioSolicitante;
    if(this.usuarioSolicitante.role === "ADMIN_ROLE"){
      this.cargarUsuarios();
    } else {
      this.usuarios = [];
    }
  }

  seleccionarUsuarioActual(usuario){
    this.usuarioActual=usuario;
    window.scroll(0,0);
  }

  cargarUsuarios() {
    this._usuarioService.obtenerTodosLosUsuarios().subscribe(
      (resp: any) => {
        this.usuarios = resp.usuarios;
      },
      error => {
        swal(
          "Error al obtener usuarios",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  cambiarPassword() {
    let passwordValidated=this.validarPasswordIguales();

    if(!passwordValidated){
      swal(
        "Error en contraseñas",
        "Las contraseñas no coinciden",
        "error"
      );
      return;
    }
    this._usuarioService.cambiarPassword(this.usuarioActual._id, this.password).subscribe(
      (resp)=>{
        this.password=null;
        this.passwordConfirm=null;
        swal(
          "Contraseña Actualizada",
          `La contraseña de ${ this.usuarioActual.nombre }, se ha actualizado correctamente`,
          "success"
        );
      },
      (error)=>{
        swal(
          "Error al actualizar contraseña",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });

  }

  validarPasswordIguales() {
    if (this.password === this.passwordConfirm) {
      return true;
    } else {
      return false;
    }
  }
}
