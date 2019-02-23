import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class MetasService {

  constructor(
    private http:HttpClient,
    private _usuarioService: UsuarioService,
  ) { }

    obtenerMeta( year, unidadDeNegocio:string ){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/meta/${ year }?unidadDeNegocio=${unidadDeNegocio}&token=${ token }`;

      return this.http.get(url);
    }

    crearMeta(metas){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/meta?token=${token}`;

      return this.http.post(url, metas);
    }

    actualizarMeta( id, metas ){
      let token = this._usuarioService.token;
      let url = URL_SERVICIOS + `/meta/${id}?token=${token}`;

      return this.http.put(url, metas);
    }



}
