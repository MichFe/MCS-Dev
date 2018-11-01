import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-catalogo-productos",
  templateUrl: "./catalogo-productos.component.html",
  styleUrls: ["./catalogo-productos.component.css"]
})
export class CatalogoProductosComponent implements OnInit {

  //Data
  familias: any[] = [
    { nombre: "Credenzas" },
    { nombre: "Mesas" },
    { nombre: "Cómodas" },
    { nombre: "Sillas" },
    { nombre: "Sillones" },
    { nombre: "Bancas" },
    { nombre: "Bancos" },
    { nombre: "Mesas" },
    { nombre: "Libreros" },
    { nombre: "Lámparas" },
    { nombre: "Ocasionales" },
    { nombre: "Salas" },
    { nombre: "Cabeceras" },
    { nombre: "Bases de Cama" },
    { nombre: "Libreros" }
  ];

  productos = [
    {
      codigo: "MDC-05-2",
      nombre: "Mesa de Centro Gota CH de Parota",
      familia: "Mesas",
      img: "../../../assets/images/gallery/chair3.jpg",
      id:1
    }
  ];

  carrito=[];

  constructor() {}

  ngOnInit() {}

  agregarACarrito(producto){
    let existe=this.carrito.find( this.checkProducto );
    
    if(existe){
      existe.cantidad+=1
    }else{
      producto.cantidad=1;
      this.carrito.push(producto);
    }
    

  }

  checkProducto(producto){
    return producto.id;
  }
}
