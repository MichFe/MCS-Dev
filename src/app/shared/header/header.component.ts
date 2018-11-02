import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {

  usuario:Usuario;

  constructor(
    public _usuarioService:UsuarioService
  ) {}

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  logout(){
    this._usuarioService.logout();
  }
}
