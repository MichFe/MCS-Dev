import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales'
})
export class InicialesPipe implements PipeTransform {

  transform(nombre: string): string {

    let nombreSeparado:string[] = nombre.split(' ');

    let nombre1:string=nombreSeparado[0];
    let nombre2:string=nombreSeparado[nombreSeparado.length -1];
    let iniciales:string;

    if(nombreSeparado.length===1){
      iniciales = nombre1.substr(0,1)+' ';
    }else{
      iniciales = nombre1.substr(0,1) + nombre2.substr(0,1);
    }
    
    return iniciales;
  }

}
