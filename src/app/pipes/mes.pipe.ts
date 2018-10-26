import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mes'
})
export class MesPipe implements PipeTransform {

  transform(mesNum:number): any {
    let mesStr:String='';

    switch (mesNum) {
      case 0:
       mesStr='Enero';
        break;

      case 1:
        mesStr='Febrero';
        break;

      case 2:
        mesStr='Marzo';
        break;

      case 3:
        mesStr='Abril';
        break;

      case 4:
        mesStr='Mayo';
        break;

      case 5:
        mesStr='Junio';
        break;
      
      case 6:
        mesStr='Julio';
        break;
      
      case 7:
        mesStr='Agosto';
        break;
      
      case 8:
        mesStr='Septiembre';
        break;
      
      case 9:
        mesStr='Octubre';
        break;

      case 10:
        mesStr='Noviembre';
        break;

      case 11:
        mesStr='Diciembre';
        break;

      default:
        break;
    }
    return mesStr;
  }

}
