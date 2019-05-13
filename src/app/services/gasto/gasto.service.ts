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
  
  obtenerSaldoPendienteYMontoPagado(year, categoria: string = '0') {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/saldoPendiente/${year}?categoria=${categoria}&token=${token}`;

    return this.http.get(url);
  }

  obtenerGastosMensuales(year: number, categoria: string = '0') {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/gastosMensuales/${year}?categoria=${categoria}&token=${token}`;

    return this.http.get(url);

  }

  obtenerGastosDiarios(year: number, month: number, categoria: string = '0') {
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/gastosDiarios/${year}/${month}?categoria=${categoria}&token=${token}`;

    return this.http.get(url);
  }

  obtenerGastosParaTablaReporteGastos(desde: number, categoria='0', year:number, mes:number){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/gasto/tablaGastos?year=${year}&mes=${mes}&categoria=${categoria}&token=${token}&desde=${desde}`;
  
    return this.http.get(url);
  }

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
