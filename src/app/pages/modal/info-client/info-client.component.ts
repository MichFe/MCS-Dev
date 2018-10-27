import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from "../../../models/cliente.model";
import { UsuarioService } from '../../../services/usuarios/usuario.service';


@Component({
  selector: "app-info-client",
  templateUrl: "./info-client.component.html",
  styleUrls: ["./info-client.component.css"]
})
export class InfoClientComponent implements OnInit, OnChanges {
  @Input()
  cliente: any = {};

  @Output()
  cambiosCliente: EventEmitter<any> = new EventEmitter();

  editando: boolean = false;
  outAnimation: boolean = false;

  nombre: string;
  telefono: string;
  direccion: string;
  email: string;

  nuevoNombre: string;
  nuevoTelefono: string;
  nuevaDireccion: string;
  nuevoCorreo: string;

  constructor(
    public _usuarioService:UsuarioService
  ) {}

  ngOnInit() {}

  resetearModal() {
    this.editando = false;
    this.outAnimation = false;
  }

  ngOnChanges() {
   
    this.nombre = this.cliente.nombre;
    this.telefono = this.cliente.telefono;
    this.direccion = this.cliente.direccion;
    this.email = this.cliente.email;
    
  }

  guardarCambios() {

    this.nombre=this.nuevoNombre;
    this.telefono=this.nuevoTelefono;
    this.direccion=this.nuevaDireccion;
    this.email=this.nuevoCorreo;
    
    
    let clienteActualizado = new Cliente(
      this.nuevoNombre,
      this.nuevoTelefono,
      this.nuevaDireccion,
      this.nuevoCorreo,
      this.cliente.estatus,
      this.cliente.img,
      this.cliente._id,
      this.cliente.usuarioCreador,
      this._usuarioService.usuario._id
    );

    this.cambiosCliente.emit(clienteActualizado);

    this.cerrarEdicion();
  }

  cerrarEdicion() {
    this.outAnimation = true;

    setTimeout(() => {
      this.editando = false;
      this.outAnimation = false;
    }, 500);
  }

  cerrarInformacion() {
    this.outAnimation = true;

    setTimeout(() => {
      this.editando = true;
      this.outAnimation = false;
    }, 500);

    this.nuevoNombre=this.nombre;
    this.nuevoTelefono=this.telefono;
    this.nuevaDireccion=this.direccion;
    this.nuevoCorreo=this.email;
  }
}
