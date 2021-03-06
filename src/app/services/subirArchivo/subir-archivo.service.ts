import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo:File, tipo:string, id: string, indexCotizacion:number=null ){

    return new Promise( (resolve, reject)=>{

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            // console.log('Imagen subida');
            resolve( JSON.parse(xhr.response) );

          }else{
            // console.log('Fallo la subida');
            reject( xhr.response );
            
          }

        }
      };

      let url = URL_SERVICIOS + '/upload/imagen/' + tipo + '/' + id;

      //Si hay index cotizacion cambiamos la url
      if(indexCotizacion!==null){
        url = URL_SERVICIOS + `/upload/imagen/${tipo}/${id}?indexCotizacion=${indexCotizacion}`;
      }

      xhr.open( 'PUT', url, true );
      xhr.send( formData );

    });

   

  }

  subirAudio(archivo: File, coleccion: string, id: string) {

    return new Promise((resolve, reject) => {      

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('audio', archivo, id+".mp3");

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            // console.log('Imagen subida');
            resolve(JSON.parse(xhr.response));

          } else {
            // console.log('Fallo la subida');
            reject(xhr.response);

          }

        }
      };

      let url = URL_SERVICIOS + '/uploadAudio/' + coleccion + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send(formData);

    });



  }

}
