import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'audio'
})
export class AudioPipe implements PipeTransform {

  transform(audioName: any ): any {
    
    let url = URL_SERVICIOS + '/audio/' + audioName;



    return url;

  }

}
