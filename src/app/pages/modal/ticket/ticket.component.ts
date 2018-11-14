import { Component, OnInit, Input } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito/carrito.service';

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"]
})
export class TicketComponent implements OnInit {
  @Input()
  carrito: any;

  @Input()
  metodoDePago: string;

  @Input()
  incluirIva: boolean = false;

  @Input()
  totalCarrito: number;

  @Input()
  iva: number;

  //Variables
  tipoPago: string;
  seleccionIva: any;
  efectivo: number;

  constructor(public _carritoService: CarritoService) {}

  ngOnInit() {
    // this.carrito=this._carritoService.carrito;
  }

  obtenerCarrito() {
    this.carrito = this._carritoService.carrito;
  }

  enviarCarrito() {
    this._carritoService.carrito = this.carrito;
  }

  resetearModal() {}

  imprimirTicket() {
    let ticket = document.getElementById("documento-ticket");
    let domClone = ticket.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

  generarVenta() {}
}
