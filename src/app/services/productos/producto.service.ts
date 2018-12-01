import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from 'src/app/models/producto.model';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    public http:HttpClient,
    public _usuarioService:UsuarioService
  ) { }

  actualizarProducto( producto ){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/producto/${ producto._id }?token=${ token }`;

    return this.http.put( url, producto );
  }

  registrarProducto( producto:Producto){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/producto?token=${ token }`;

      return this.http.post( url, producto );
  }

  obtenerProductosPorFamilia( familia:string, pagina:number = 1 ){
    let token = this._usuarioService.token;
    let desde = (pagina - 1) * 10;
    let url = URL_SERVICIOS + `/producto/familia/${ familia }?token=${ token }&desde=${ desde }`;

    return this.http.get( url );

  }

}
