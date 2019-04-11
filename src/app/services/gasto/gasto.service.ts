import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  constructor(
    private http:HttpClient,
    private _usuarioService: UsuarioService
  ) { }

  obtenerGastosPaginados(desde){
    let token= this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto?token=${ token }&desde=${ desde }`;

    return this.http.get(url);
  }

  crearGasto(gasto){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto?token=${ token }`;

    return this.http.post(url, gasto);
  }

  actualizarGasto(gasto){
    let idGasto = gasto._id;
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/${ idGasto }?token=${ token }`;

    return this.http.put(url, gasto);
  }

  eliminarGasto(idGasto){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/${ idGasto }?token=${ token }`;

    return this.http.delete(url);
  }


}
