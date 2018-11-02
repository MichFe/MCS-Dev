import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { Usuario } from '../../models/usuario.model';

declare var $: any;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  hayImagen:boolean=false;
  imagenTemporal: string;

  constructor(public _usuarioService: UsuarioService) {
    $(()=>{
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  actualizarUsuario(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    this.usuario.email = usuario.email;

    this._usuarioService.actualizarUsuario(this.usuario).subscribe();
  }

  seleccionImagen(evento) {
    let file: File = evento.target.files[0];

    if (!file) {
      this.imagenSubir = null;
      this.hayImagen=false; 
      this.imagenTemporal=null;     
      return;
    }

    if(file.type.indexOf('image')<0){
      swal(
        'Típo de archivo inválido',
        'Seleccione una imágen',
        'error'
      );

      this.imagenSubir=null;
      return;
    }


    
    this.imagenSubir = file;    
    this.hayImagen=true;

    let reader = new FileReader();
    let urlImagenTemporal= reader.readAsDataURL( file );

    reader.onloadend = ()=> this.imagenTemporal = reader.result;
    
  }

  subirImagen(){

    if(!this.subirImagen){
      return;
    }

    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );

  }
}
