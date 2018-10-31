import { Directive, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: "[infiniteScroll]"
})
export class InfiniteScrollDirective {
  //Required Inputs 
  @Input() boxId: string;
  @Input() habilitado: boolean = false;

  //Config inputs
  @Input() scrollUpPercentage: number = 10;
  @Input() scrollDownPercentage: number = 80;

  //Output callbacks
  @Output() scrollUp: EventEmitter<any> = new EventEmitter();
  @Output() scrollDown: EventEmitter<any> = new EventEmitter();

  //Variables generales
  scrollHeight: number;
  scrollTop: number;

  lastScrollTop: number = 0;
  cajaAltura: number = 0;

  constructor() {
    this.addScrollListener();
  }

  ngAfterViewInit() {
    this.addScrollListener();
  }

  addScrollListener() {
    let box = document.getElementById(this.boxId);

    if (box) {

      document
        .getElementById(this.boxId)
        .addEventListener("scroll", (evento: any) => {
          //Leyendo altura de caja,altura del scroll y posición del scroll
          this.cajaAltura = evento.target.clientHeight;
          this.scrollHeight = evento.target.scrollHeight;
          this.scrollTop = evento.target.scrollTop;

          //validando dirección scroll
          let direccion = this.validateScrollDirection(evento.target.scrollTop);

          //trigger callback
          if (direccion == "down") {
            let porcentaje = 
              (( this.scrollTop + this.cajaAltura ) / this.scrollHeight) * 100;
              // console.log(porcentaje);
              
              if (porcentaje >= this.scrollDownPercentage) {
              this.trigger("down");
            }
            return;
          }

          if (direccion == "up") {
            let porcentaje =
              ((this.scrollTop ) / this.scrollHeight) * 100;
            // console.log(porcentaje);

            if (porcentaje <= this.scrollUpPercentage) {
              this.trigger("up");
            }
            return;
          }
        });
    }
  }

  validateScrollDirection(scrollTop) {
    let direccion:string;
    if (scrollTop > this.lastScrollTop) {
      direccion = "down";
    } else {
      direccion = "up";
    }

    this.lastScrollTop=scrollTop;
    return direccion;
  }

  trigger(direccion) {

    if (this.habilitado){
      if (direccion == "up") {
        this.scrollUp.emit();
      } else {
        this.scrollDown.emit();
      }
    }
    return
  }
}
