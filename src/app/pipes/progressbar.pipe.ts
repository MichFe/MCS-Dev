import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressbar'
})
export class ProgressbarPipe implements PipeTransform {

  transform( actual: number, total: number): string {

    let porcentaje = (actual/total)*100;
    porcentaje = Math.floor(porcentaje);

    let style = `width: ${porcentaje}%`;

    return style;

  }

}
