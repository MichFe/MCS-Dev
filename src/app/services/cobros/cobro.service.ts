import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CobroService {

  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }

  registrarCobro(cobro){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cobro?token=${token}`;

    return this.http.post(url, cobro);
  }

  obtenerCobro(ventaId){
    let token = this._usuarioService.token;
    let url =  URL_SERVICIOS + `/cobro/${ventaId}?token=${token}`;

    return this.http.get(url);
  }

  eliminarCobro(cobroId){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cobro/${cobroId}?token=${token}`;

    return this.http.delete(url);
  }

}
