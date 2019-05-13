import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService
  ) { }
  
  obtenerNominaFechaEnRango(fecha:Date){
    let token = this._usuarioService.token;
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let year = fecha.getFullYear();

    let url = URL_SERVICIOS + `/nomina/rango/${dia}/${mes}/${year}?token=${token}`;

    return this.http.get(url);
  }

  obtenerNominaPorFechaInicial(fechaInicial){
    let token = this._usuarioService.token;
    let dia = fechaInicial.getDate();
    let mes = fechaInicial.getMonth();
    let year = fechaInicial.getFullYear();
    let url = URL_SERVICIOS + `/nomina/${dia}/${mes}/${year}?token=${token}`;

    return this.http.get(url);
  }

  crearNomina(nomina){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/nomina?token=${token}`;

    return this.http.post(url, nomina);
  }

  actualizarNomina(nomina){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/nomina/${nomina._id}?token=${token}`;

    return this.http.put(url, nomina);
  }

  eliminarNomina(nominaId){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/nomina/${nominaId}?token=${token}`;

    return this.http.delete(url);
  }


}
