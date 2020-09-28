import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-modal-nota-de-venta',
  templateUrl: './modal-nota-de-venta.component.html',
  styleUrls: ['./modal-nota-de-venta.component.css']
})
export class ModalNotaDeVentaComponent implements OnInit {

  @Input()
  venta: any;

  totalDescuento = 0;

  constructor() { }

  ngOnInit() {

    
  }
  
  ngOnChanges(): void {
    
    this.calcularDescuento();
    
  }

  calcularDescuento(){
    this.totalDescuento = 0;    

    if (this.venta && this.venta.carrito ){

      this.venta.carrito.forEach((producto) => {
        if (producto.descuento) {
          this.totalDescuento += ( producto.descuento * producto.cantidad );
        }
      });

    }
    

  }

  imprimirNota(){
    
    let nota = document.getElementById("documento-nota");
    let domClone = nota.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

}
