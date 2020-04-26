import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(
    private http:HttpClient,
    private _usuarioService:UsuarioService,
  ) { }

    obtenerTodosLosProveedores(){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/proveedor/todosLosProveedores?token=${ token }`;

      return this.http.get(url);
    }

    //Obtener proveedores paginados
    obtenerProveedores(desde){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/proveedor?desde=${desde}&token=${ token }`;

      return this.http.get(url);
    }

    crearProveedor(proveedor){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/proveedor?token=${token}`;

      return this.http.post(url, proveedor);
    }

    actualizarProveedor(id,proveedorActualizado){
      let token=this._usuarioService.token;
      let url = URL_SERVICIOS + `/proveedor/${id}?token=${token}`;

      return this.http.put(url, proveedorActualizado);
    }

    eliminarProveedor(id){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/proveedor/${id}?token=${token}`;

      return this.http.delete(url);
    }

    buscarProveedor(termino:string){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/busqueda/coleccion/proveedor/${termino}?token=${token}`;

      return this.http.get(url);
    }



}
