import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http:HttpClient,
    private _usuarioService:UsuarioService
  ) { }

  registraPago(pago) {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/pago?token=${token}`;

    return this.http.post(url, pago);
  }

  obtenerPagosPaginados(desde){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/pago?token=${token}&desde=${desde}`;

    return this.http.get(url);
  }

  obtenerPago(compraId) {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/pago/${compraId}?token=${token}`;

    return this.http.get(url);
  }

  eliminarPago(pagoId) {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/pago/${pagoId}?token=${token}`;

    return this.http.delete(url);
  }
}
