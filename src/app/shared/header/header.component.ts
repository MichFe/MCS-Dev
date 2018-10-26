import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios/usuario.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {


  constructor(
    public _usuarioService:UsuarioService
  ) {}

  ngOnInit() {}

  logout(){
    this._usuarioService.logout();
  }
}
