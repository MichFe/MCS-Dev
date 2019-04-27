import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-nota-de-compra',
  templateUrl: './modal-nota-de-compra.component.html',
  styleUrls: ['./modal-nota-de-compra.component.css']
})
export class ModalNotaDeCompraComponent implements OnInit {

  @Input()
  compra:any={};

  fecha = new Date();

  constructor() { }

  ngOnInit() {
  }

  resetearModal(){}

  imprimirNotaDeCompra() {
    let notaCompra = document.getElementById("documento-notaCompra");
    let domClone = notaCompra.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

}
