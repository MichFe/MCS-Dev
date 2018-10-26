import { Component, OnInit, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: "app-nuevo-cliente",
  templateUrl: "./nuevo-cliente.component.html",
  styleUrls: ["./nuevo-cliente.component.css"]
})
export class NuevoClienteComponent implements OnInit {

  @Output()
  clienteNuevo: EventEmitter<any> = new EventEmitter();

  mensajeRequeridos="Favor de completar el formulario";
  completo:boolean=false;

  nombre: string='';
  telefono: string='';
  direccion: string='';
  correo: string='';

  constructor() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

  ngOnInit() {}

  resetearModal(){
    this.nombre="";
    this.telefono="";
    this.direccion="";
    this.correo="";
  }

  validarFormulario(){
    if (this.nombre == '' || this.telefono == '' || this.direccion == ''){

      this.completo=false;

    }else{

      this.completo=true;

    }


  }

  registrarCliente() {

    if( this.nombre=='' || this.telefono=='' || this.direccion==''){
      return;
    }

    let nuevoCliente = {
      'nombre': this.nombre,
      'telefono': this.telefono,
      'direccion': this.direccion,
      'correo': this.correo,
      'imagen':'../assets/images/users/default.png'
    };

    this.clienteNuevo.emit(nuevoCliente);

    $("#nuevoCliente").modal("toggle");

    this.resetearModal();
    this.validarFormulario();

  }

}
