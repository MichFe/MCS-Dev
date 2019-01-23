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

  eliminarChat(id){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/chat/${ id }?token=${token}`;

    return this.http.delete(url);
  }

  obtenerTotalDeMensajesPorCliente() {
    let token = this._usuarioService.token;

    let url = URL_SERVICIOS + `/chat/conteoChats/cliente?token=${token}`;

    return this.http.get(url);
  }

  obtenertotalDeMensajesPorProyecto(clienteId){
    let token = this._usuarioService.token;
    let url= URL_SERVICIOS + `/chat/conteoChats/proyectos/${ clienteId }?token=${ token }`;

    return this.http.get(url);
    
  }

}
