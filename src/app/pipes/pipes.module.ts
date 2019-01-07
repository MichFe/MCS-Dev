import { NgModule } from '@angular/core';
import { MesPipe } from './mes.pipe';
import { InicialesPipe } from './iniciales.pipe';
import { ImagenPipe } from './imagen.pipe';
import { AudioPipe } from './audio.pipe';

@NgModule({
  imports: [],
  declarations: [
    MesPipe,
    InicialesPipe,
    ImagenPipe,
    AudioPipe
  ],
  exports: [
    MesPipe,
    InicialesPipe,
    ImagenPipe,
    AudioPipe
  ]
})
export class PipesModule { }
