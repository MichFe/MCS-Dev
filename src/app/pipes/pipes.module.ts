import { NgModule } from '@angular/core';
import { MesPipe } from './mes.pipe';
import { InicialesPipe } from './iniciales.pipe';
import { ImagenPipe } from './imagen.pipe';
import { AudioPipe } from './audio.pipe';
import { ProgressbarPipe } from './progressbar.pipe';

@NgModule({
  imports: [],
  declarations: [
    MesPipe,
    InicialesPipe,
    ImagenPipe,
    AudioPipe,
    ProgressbarPipe
  ],
  exports: [
    MesPipe,
    InicialesPipe,
    ImagenPipe,
    AudioPipe,
    ProgressbarPipe
  ]
})
export class PipesModule { }
