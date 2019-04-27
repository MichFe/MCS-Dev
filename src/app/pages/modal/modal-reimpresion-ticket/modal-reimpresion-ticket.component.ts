import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-reimpresion-ticket',
  templateUrl: './modal-reimpresion-ticket.component.html',
  styleUrls: ['./modal-reimpresion-ticket.component.css']
})
export class ModalReimpresionTicketComponent implements OnInit {

  @Input()
  venta:any={};

  constructor() { }

  ngOnInit() {
  }

  imprimirTicket(){
    let ticket = document.getElementById("documento-ticket");
    let domClone = ticket.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

}
