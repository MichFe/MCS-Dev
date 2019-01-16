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

  obtenerVentasMensuales(year:number){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventasMensuales/${ year }?token=${ token }`;

    return this.http.get(url);

  }

  obtenerVentasDiarias(year:number, month:number){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventasDiarias/${year}/${month}?token=${token}`;

    return this.http.get(url);
  }

  obtenerSaldoPendienteYMontoPagado(){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/saldoPendiente?token=${token}`;

    return this.http.get(url);
  }

  obtenerListaDeClientesConSaldoPendiente(){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/clientesConSaldo?token=${token}`;

    return this.http.get(url);
  }

  obtenerVentasConSaldoPendienteDeUnCliente(clienteId:string){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventasConSaldo/${clienteId}?token=${token}`;

    return this.http.get(url);
  }



}
