import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: any, tipo: any='usuario'): any {
        

    let url = URL_SERVICIOS + '/img';

    if(!img && tipo=='usuario'){
      return url + '/usuario/default'
    }

    switch( tipo ){
      case 'usuario':
        url += '/usuario/' + img;
      break;

      case 'cliente':
        url += '/cliente/' + img;        
      break;

      case 'proyecto':
        url += '/proyecto/' + img;
      break;

      case 'producto':
        url += "/producto/" + img;
      break;

      case 'chat':
        url += '/chat/' + img;
      break;

      default:
        console.log('El tipo de imagen utilizado en el pipe no existe');
        url += '/usuario/default'     
    }
    
    return url;
  }

}
