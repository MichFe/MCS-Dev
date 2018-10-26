import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

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
  correo: string;

  nuevoNombre: string;
  nuevoTelefono: string;
  nuevaDireccion: string;
  nuevoCorreo: string;

  constructor() {}

  ngOnInit() {}

  resetearModal() {
    this.editando = false;
    this.outAnimation = false;
  }

  ngOnChanges() {
    this.nombre = this.cliente.nombre;
    this.telefono = this.cliente.telefono;
    this.direccion = this.cliente.direccion;
    this.correo = this.cliente.correo;
  }

  guardarCambios() {

    this.nombre=this.nuevoNombre;
    this.telefono=this.nuevoTelefono;
    this.direccion=this.nuevaDireccion;
    this.correo=this.nuevoCorreo;
    
    let nuevaInformacion = {
      nombre: this.nuevoNombre,
      telefono: this.nuevoTelefono,
      direccion: this.nuevaDireccion,
      correo: this.nuevoCorreo
    };

    this.cambiosCliente.emit(nuevaInformacion);

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
    this.correo=this.nuevoCorreo;
  }
}
