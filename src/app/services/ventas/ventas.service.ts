import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(
    private http:HttpClient,
    private _usuarioService: UsuarioService
  ) { }

  obtenerVentas(desde:number){

    let url = URL_SERVICIOS + '/venta?token=' + this._usuarioService.token + '&desde=' + desde;
  
    return this.http.get(url);

  }

}
