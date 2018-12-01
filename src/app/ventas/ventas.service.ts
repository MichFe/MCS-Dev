import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../services/usuarios/usuario.service';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  generarVenta( venta ){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta?token=${ token }`;

    return this.http.post( url, venta);


  }

}
