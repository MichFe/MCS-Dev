import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
declare var $: any;

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements OnInit {

  @Input()
  tituloModal: string = "Nuevo Proyecto";

  @Output()
  nuevoProyecto: EventEmitter<any> = new EventEmitter();
  
  nombreProyecto: string = "";
  descripcionProyecto: string = "";
  
  mensajeRequeridos: string =
    "Favor de completar el formulario";

  constructor() {
    
  }

  ngOnInit() {
   
  }

  

  resetearModal(){
    
    this.nombreProyecto="";
    this.descripcionProyecto="";
    
  }

  guardarProyecto() {

    //validando que el campo nombre de proyecto y descripción de proyecto no esten vacios
    if (this.nombreProyecto == "" || this.descripcionProyecto == "") {
      return;
    }

    this.nuevoProyecto.emit({
      nombreProyecto: this.nombreProyecto,
      descripcionProyecto: this.descripcionProyecto
    });
    
    this.nombreProyecto = "";
    this.descripcionProyecto = "";

    $('#nuevoProyecto').modal('toggle');


  }


}
