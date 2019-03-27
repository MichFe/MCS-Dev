import {Injectable} from '@angular/core';
import {URL_SERVICIOS} from '../../config/config';
import {HttpClient} from '@angular/common/http';
import {UsuarioService} from '../usuarios/usuario.service';
import {Requisicion} from 'src/app/models/requisicion.model';


@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {
  
  //Variables
  uriRequisicion = 'requisicion';
  totalRequisicionesPorAprobar:number=0;

  constructor(
    public http: HttpClient,
    private _usuarioService: UsuarioService
  ) {
  }

  obtenerRequisicionesAprobadas( pagina:number){
    let token = this._usuarioService.token;
    let desde = (pagina - 1) * 10;
    let url = URL_SERVICIOS + `/requisicion/aprobadas?token=${ token }&desde=${ desde }`;

    return this.http.get(url);
  }

  obtenerRequisicionesPorAprobar( pagina:number ){
    let token = this._usuarioService.token;
    let desde = (pagina - 1) * 10;
    let url = URL_SERVICIOS + `/requisicion/porAprobar?token=${ token }&desde=${ desde }`;

    return this.http.get(url);
  }

  obtenerRequisicionesDelUsuario(pagina){
    const token = this._usuarioService.token;
    const usuarioId=this._usuarioService.id;
    const desde = (pagina - 1) * 10;
    const url = URL_SERVICIOS + `/requisicion?token=${ token }&desde=${ desde }&id=${ usuarioId }`;
    return this.http.get(url);
  }

  obtenerRequisiciones( pagina ) {
    const token = this._usuarioService.token;
    const desde = (pagina - 1) * 10;
    const url = URL_SERVICIOS + '/' + this.uriRequisicion + '?token=' + token + '&desde=' + desde;
    return this.http.get(url);
  }

  guardarRequisicion(requisicion: Requisicion) {
    const token = this._usuarioService.token;
    const url = URL_SERVICIOS + '/' + this.uriRequisicion + '?token=' + token;
    return this.http.post(url, requisicion);
  }

  actualizarRequisicion(requisicion) {
    const token = this._usuarioService.token;
    const requsicionId = requisicion._id;
    const url = URL_SERVICIOS + '/requisicion/' + requsicionId + '?token=' + token;
    return this.http.put(url, requisicion);
  }

  buscarRequisicion(termino) {
    const token = this._usuarioService.token;
    const url = URL_SERVICIOS + '/busqueda/coleccion/cliente/' + termino + '?token=' + token;
    return this.http.get(url);
  }

  eliminarRequisiciones(requisicion: Requisicion) {
    const token = this._usuarioService.token;
    const requsicionId = requisicion._id;
    const url = URL_SERVICIOS + '/requisicion/' + requsicionId + '?token=' + token;
    return this.http.delete(url);

  }
}
