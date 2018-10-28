import { Injectable } from '@angular/core';
import { Proyecto } from "../../models/proyecto.model";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/config";
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(
    public http:HttpClient,
    public _usuarioService:UsuarioService
  ) { }

  getProyectos(clienteId, pagina){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + '/proyecto/' + clienteId + '?token=' + token + '&deste=' + pagina;
    
    return this.http.get( url );
  }

  postProyecto( proyecto ){
    let token = this._usuarioService.token;
    let url= URL_SERVICIOS + '/proyecto?token=' + token;
    
    return this.http.post( url, proyecto );
  }

  
}
