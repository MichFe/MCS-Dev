import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  clienteSeleccionado:any={};
  proyectoSeleccionado:any={};


  clientes:any[]=[
      {
        nombre: "Michelle Felix",
        telefono: "477-123-45-67",
        direccion: "Marioano Escobedo 1300, Centro, León, Guanajuato",
        correo: "mobla@gmail.com",
        imagen: "../assets/images/users/1.jpg",
        estatus: "Activo",
        clientId: 1
      },
      {
        nombre: "Rodrigo Martinez",
        imagen: "../assets/images/users/2.jpg",
        telefono: "477-123-45-67",
        direccion: "Marioano Escobedo 1300, Centro, León, Guanajuato",
        correo: "mobla@gmail.com",
        estatus: "Inactivo",
        clientId: 2
      }
  ];

  proyectos:any[]= [
    {
      clientId: 1,
      proyectId:1,
      nombre: "Sala Cafetería",
      imagen: "../assets/images/gallery/chair.jpg",
      estatus: "Activo",
      
    }
  ]
  
  constructor() { }


}
