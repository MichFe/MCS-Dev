import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  menuDelUsuario:any=[];

  constructor(
    private _usuarioService: UsuarioService,
    private http:HttpClient
  ) { }

  obtenerMenuDeUsuario(usuarioId){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/menu/${ usuarioId }?token=${ token }`;

    return this.http.get(url);
  }

  crearMenuDefault(usuarioId){
    let usuario = { usuario: usuarioId }
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/menu?token=${ token }`;

    return this.http.post(url, usuario);
  }

  actualizarMenu(usuarioId, menu){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/menu/${ usuarioId }?token=${ token }`;
    let objetoMenu = { menu };
    return this.http.put(url, objetoMenu);
  }

}
