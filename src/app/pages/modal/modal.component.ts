import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Proyecto } from "../../models/proyecto.model";
import { Cliente } from "../../models/cliente.model";
import { UsuarioService } from '../../services/usuarios/usuario.service';


declare var $: any;

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements OnInit {

  @Input()
  tituloModal: string = "Nuevo Proyecto";

  @Input()
  cliente: Cliente;

  @Output()
  nuevoProyecto: EventEmitter<any> = new EventEmitter();
  
  nombreProyecto: string = "";
  descripcionProyecto: string = "";
  
  mensajeRequeridos: string =
    "Favor de completar el formulario";

  constructor(
    public _usuarioService:UsuarioService
  ) {
    
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

    let proyecto = new Proyecto(
      this.nombreProyecto,
      this.descripcionProyecto,
      this.cliente._id,
      'Concepto',
      null,
      this._usuarioService.id,
      this._usuarioService.id
    );

    this.nuevoProyecto.emit( proyecto );
    
    this.nombreProyecto = "";
    this.descripcionProyecto = "";

    $('#nuevoProyecto').modal('toggle');


  }


}
