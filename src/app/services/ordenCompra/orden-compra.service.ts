import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  constructor(
    private http:HttpClient,
    private _usuarioService:UsuarioService
  ) { }


  crearCompra(compra){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra?token=${ token }`;

    return this.http.post(url, compra);
    
  }

  obtenerCompras(desde, soloPedidos=false){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra?token=${token}&desde=${desde}&soloPedidos=${soloPedidos}`;

    return this.http.get(url);

  }

  actualizarCompra(compra){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra/${compra._id}?token=${ token }`;

    return this.http.put(url, compra);
  }

  buscarCompraPorRequisicion(requisicion){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra/buscarPorRequisicion/${requisicion._id}?token=${token}`;
  
    return this.http.get(url);
  }

  obtenerComprasConSaldoPendienteDeUnProveedor(idProveedor){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra/comprasConSaldo/${ idProveedor }?token=${ token }`;

    return this.http.get(url);
  }

  obtenerListaDeProveedoresConSaldoPendiente(){
    let token =this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra/proveedoresConSaldo?token=${ token }`;

    return this.http.get(url);
  }

  obtenerSaldoPendienteDeTodosLosTiempos(){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/compra/saldoPendiente/todosLosTiempos?token=${ token }`;

    return this.http.get(url);
  }



}
