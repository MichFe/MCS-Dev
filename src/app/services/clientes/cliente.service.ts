import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { Cliente } from "../../models/cliente.model";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    public http:HttpClient,
    private _usuarioService:UsuarioService
  ) { }

  obtenerClientes( pagina ){
    let token = this._usuarioService.token;
    let desde = pagina;

    let url = URL_SERVICIOS + '/cliente?token=' + token + '&desde=' + desde;

    return this.http.get( url );
  }

  guardarCliente( cliente: Cliente ){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + '/cliente?token=' + token;

    return this.http.post( url, cliente );

  }

  actualizarCliente( cliente: Cliente ){
    let token = this._usuarioService.token;
    let clientId = cliente._id;

    let url = URL_SERVICIOS + '/cliente/' + clientId + '?token=' + token;

    return this.http.put( url, cliente);

  }

}
