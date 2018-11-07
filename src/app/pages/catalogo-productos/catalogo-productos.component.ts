import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/productos/producto.service';

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
    { nombre: "Libreros" },
    { nombre: "Lámparas" },
    { nombre: "Ocasionales" },
    { nombre: "Salas" },
    { nombre: "Cabeceras" },
    { nombre: "Bases de Cama" }
  ];

  productos = [ ];

  carrito = [];

  constructor(public _productoService: ProductoService) {}

  ngOnInit() {}

  obtenerProductosPorFamilia(familia: string) {
    this._productoService.obtenerProductosPorFamilia(familia).subscribe(
      (resp: any) => {
        this.productos = resp.productos;
      },
      error => {
        swal(
          "Error al consultar productos",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  agregarACarrito(producto) {
    let existe = this.checkCarrito(producto);

    if (existe) {
      existe.cantidad += 1;
    } else {
      producto.cantidad = 1;
      this.carrito.push(producto);
    }
  }

  checkCarrito(producto) {
    return this.carrito.find(elemento => {
      return elemento._id === producto._id;
    });
  }
}
