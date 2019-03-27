import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class DeleteImageService {

  constructor(
    private http: HttpClient
  ) { }


  eliminarImagenCotizacion(id, indexCotizacion){
    let url = URL_SERVICIOS + `/eliminarImagen/cotizacion/${id}?indexCotizacion=${indexCotizacion}`;

    return this.http.delete(url);
  }

}
