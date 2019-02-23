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

  obtenerVentaPorId(ventaId){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventaPorId/${ventaId}?token=${token}`;

    return this.http.get(url);
  }

  obtenerVentas(desde:number, unidadDeNegocio: string='0', year:number){
    let url = URL_SERVICIOS + `/venta/tablaVentas?year=${year}&unidadDeNegocio=${unidadDeNegocio}&token=` + this._usuarioService.token + '&desde=' + desde;
    
    return this.http.get(url);

  }

  obtenerVentasMensuales(year:number, unidadDeNegocio:string='0'){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventasMensuales/${ year }?unidadDeNegocio=${unidadDeNegocio}&token=${ token }`;

    return this.http.get(url);

  }

  obtenerVentasDiarias(year:number, month:number, unidadDeNegocio:string='0'){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/ventasDiarias/${year}/${month}?unidadDeNegocio=${unidadDeNegocio}&token=${token}`;

    return this.http.get(url);
  }

  obtenerSaldoPendienteYMontoPagado(year,unidadDeNegocio:string='0'){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/saldoPendiente/${year}?unidadDeNegocio=${unidadDeNegocio}&token=${token}`;

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

  obtenerSaldoPendienteDeTodosLosTiempos(){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/saldoPendiente/todosLosTiempos?token=${token}`;

    return this.http.get(url);
  }

  actualizarVenta(id, ventaActualizada, devolucion:number=0){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/${id}?token=${token}&devolucion=${devolucion}`;

    return this.http.put(url,ventaActualizada);
  }

  eliminarVenta(id){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/venta/${id}?token=${token}`;

    return this.http.delete(url);
  }



}
