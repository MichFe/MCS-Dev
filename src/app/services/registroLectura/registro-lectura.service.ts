import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroLecturaService {

  //Data
  registroLectura:any[];

  constructor(
    private _usuarioService:UsuarioService,
    private http: HttpClient
  ) { }

  obtenerRegistroLectura(){
    let usuarioId = this._usuarioService.id;
    let token = this._usuarioService.token;

    let url = URL_SERVICIOS + `/registroLectura/${usuarioId}?token=${token}`;

    return this.http.get(url);
  }

  crearRegistroLectura(registroLectura){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/registroLectura?token=${token}`;

    return this.http.post(url, registroLectura);

  }

  actualizarRegistroLectura(registroLectura){
    let token = this._usuarioService.token;

    let url = URL_SERVICIOS + `/registroLectura/${registroLectura._id}?token=${token}`;
    
    return this.http.put(url, registroLectura);
    
  }

  setearRegistroLectura(registroLectura){
    this.registroLectura=registroLectura;
  }


}
