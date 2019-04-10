import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(
    private usuarioService:UsuarioService,
    private http: HttpClient
  ) { }

  obtenerPermisos(userId){
    let token= this.usuarioService.token;
    let url = URL_SERVICIOS + `/permisos/${ userId }?token=${ token }`;

    return this.http.get(url);
  }

  crearPermisos(permisos){
    let token = this.usuarioService.token;
    let url = URL_SERVICIOS + `/permisos?token=${ token }`;

    return this.http.post(url, permisos);
  }

  actualizarPermisos(permisos){
    let token = this.usuarioService.token;
    let url = URL_SERVICIOS + `/permisos/${ permisos.usuario }?token=${ token }`;

    return this.http.put(url, permisos);
  }

  eliminarPermisos(userId){
    let token = this.usuarioService.token;
    let url = URL_SERVICIOS + `/permisos/${ userId }?token=${ token }`;

    return this.http.delete(url);
  }


}
