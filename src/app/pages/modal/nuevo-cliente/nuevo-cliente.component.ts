import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { UsuarioService } from '../../../services/usuarios/usuario.service';

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

  constructor(
    public _usuarioService:UsuarioService
  ) {
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

    let nuevoCliente = new Cliente(
      this.nombre,
      this.telefono,
      this.direccion,
      this.correo,
      'Activo',
      null,
      null,
      this._usuarioService.id,
      this._usuarioService.id
    );


    this.clienteNuevo.emit(nuevoCliente);

    $("#nuevoCliente").modal("toggle");

    this.resetearModal();
    this.validarFormulario();

  }

}
