import { NgModule } from '@angular/core';
import { MesPipe } from './mes.pipe';
import { InicialesPipe } from './iniciales.pipe';
import { ImagenPipe } from './imagen.pipe';

@NgModule({
  imports: [],
  declarations: [
    MesPipe,
    InicialesPipe,
    ImagenPipe
  ],
  exports: [
    MesPipe,
    InicialesPipe,
    ImagenPipe
  ]
})
export class PipesModule { }
