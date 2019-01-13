import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http:HttpClient,
    private _usuarioService: UsuarioService
  ) { }

  guardarChat(chat, chatsCargados?){
    let token = this._usuarioService.token;
    let url= URL_SERVICIOS + '/chat?token='+ token + '&chatCargados=' + chatsCargados;

    return this.http.post( url , chat);
    
  }

  obtenerChats(proyectoId, chatsCargados){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + '/chat/' + proyectoId + '?token=' + token + '&chatsCargados=' + chatsCargados;
    
    return this.http.get( url );
  
  
  }

}
