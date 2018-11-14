import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { Producto } from 'src/app/models/producto.model';

declare var $:any;

@Component({
  selector: "app-catalogo-productos",
  templateUrl: "./catalogo-productos.component.html",
  styleUrls: ["./catalogo-productos.component.css"]
})
export class CatalogoProductosComponent implements OnInit {
  //Variables
  totalProductos: number;
  familiaActual: string;
  totalCarrito: number;
  ivaCarrito: number;

  incluirIva: string;
  metodoDePago: string;

  //Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

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

  productos = [];

  carrito = [];

  constructor(public _productoService: ProductoService) {}

  ngOnInit() {}


  asignarCantidadManualmente(i) {
    swal({
      content: {
        element: "input"
      },
      text: "Asigna una cantidad",
      buttons: [true, "Aceptar"]
    })
      .then(cantidad => {
        if (!cantidad) {
          return;
        }

        this.carrito[i].cantidad = Number(cantidad);

        //Actualizamos subtotales de cada producto en el carrito
        this.calcularSubTotalCarrito();
      })
      .catch();
  }

  eliminarElementoDelCarrito(i) {
    this.carrito.splice(i, 1);
  }

  activarPaginaActual(paginaClickeada) {
    this.paginas.forEach(pagina => {
      if (paginaClickeada === pagina.pagina) {
        pagina.active = true;
      } else {
        pagina.active = false;
      }
    });
  }

  paginaAnterior() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    this.cargarProductosPagina(paginaActual.pagina - 1);
  }

  paginaSiguiente() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina * 10 >= this.totalProductos) {
      return;
    }
    this.cargarProductosPagina(paginaActual.pagina + 1);
  }

  cargarProductosPagina(pagina) {
    this._productoService
      .obtenerProductosPorFamilia(this.familiaActual, pagina)
      .subscribe(
        (resp: any) => {
          this.productos = resp.productos;
          this.totalProductos = resp.totalProductos;
          this.activarPaginaActual(pagina);
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

  paginarResultados() {
    //Validamos que existan productos
    if (!this.totalProductos) {
      return;
    }

    this.paginas = [];
    let numeroDePaginas = Math.ceil(this.totalProductos / 10);
    let objetoPagina;

    for (let pagina = 1; pagina <= numeroDePaginas; pagina++) {
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginas.push(objetoPagina);
    }

    this.paginas[0].active = true;
  }

  obtenerProductosPorFamilia(familia: string) {
    this.familiaActual = familia;
    this._productoService.obtenerProductosPorFamilia(familia).subscribe(
      (resp: any) => {
        this.productos = resp.productos;
        this.totalProductos = resp.totalProductos;

        this.paginarResultados();
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

  agregarACarrito(producto: Producto) {
    let existe = this.checkCarrito(producto);

    if (existe) {
      existe.cantidad += 1;
    } else {
      let productoCarrito = {
        codigo: producto.codigo,
        nombre: producto.nombre,
        familia: producto.familia,
        precio: producto.precio,
        img: producto.img,
        _id: producto._id,
        cantidad: 1
      };
      this.carrito.push(productoCarrito);
    }

    //Actualizamos subtotales de cada producto en el carrito
    this.calcularSubTotalCarrito();
  }

  checkCarrito(producto) {
    return this.carrito.find(elemento => {
      return elemento._id === producto._id;
    });
  }

  calcularSubTotalCarrito() {
    this.totalCarrito = 0;

    this.carrito.forEach(producto => {
      let cantidad = producto.cantidad;
      let precio = producto.precio;

      let total = cantidad * precio;
      producto.total = total;

      this.totalCarrito += total;
    });

    this.ivaCarrito = this.totalCarrito * 0.16;
  }

  cambiarPrecio(indiceCarrito) {
    swal({
      content: {
        element: "input"
      },
      text: "Asigna un nuevo precio",
      buttons: [true, "Aceptar"]
    })
      .then(precio => {
        if (!precio) {
          return;
        }
        this.carrito[indiceCarrito].precio = precio;
        this.calcularSubTotalCarrito();
      })
      .catch();
  }
}
