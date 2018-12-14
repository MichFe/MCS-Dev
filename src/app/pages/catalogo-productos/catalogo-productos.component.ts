import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { Producto } from 'src/app/models/producto.model';
import { ClienteService } from 'src/app/services/clientes/cliente.service';
import { SubirArchivoService } from 'src/app/services/subirArchivo/subir-archivo.service';

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
  totalDescuento: number;
  ivaCarrito: number;
  paginaActual: number;
  productoAEditar: any = {};
  imagenClienteNuevo: File;
  productoNombre:string;
  busquedaActiva:boolean=false;

  incluirIva: string;

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

  constructor(
    public _productoService: ProductoService,
    public _clienteService: ClienteService,
    public _subirArchivoService: SubirArchivoService
  ) {}

  ngOnInit() {}

  buscarProducto(termino) {

    if (this.productoNombre.length == 0) {
      this.productos = [];
      this.busquedaActiva = false;
      return;
    }

    if( this.productoNombre.length < 3 ){
      return;
    }

    

    this._productoService.buscarProducto(termino).subscribe(
      (resp:any) => {
        this.busquedaActiva=true;
        this.familiaActual="";
        this.productos=resp.producto;
        this.totalProductos=this.productos.length;
      },
      error => {
        swal(
          "Error al buscar producto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  resetearCarrito() {
    this.carrito = [];
  }

  imagenNuevoCliente(file) {
    this.imagenClienteNuevo = file;
  }

  registrarClienteNuevo(nuevoCliente) {
    this._clienteService.guardarCliente(nuevoCliente).subscribe(
      (resp: any) => {
        let cliente = resp.cliente;

        this._subirArchivoService
          .subirArchivo(this.imagenClienteNuevo, "cliente", cliente._id)
          .then(resp => {
            console.log(resp);
          });

        swal(
          "Registro exitoso",
          "El cliente " +
            resp.cliente.nombre +
            " se ha guardado correctamente!",
          "success"
        );
      },
      error => {
        swal(
          "Registro de cliente fallido",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  agregarDescuento(index) {
    swal("Descuento", "Selecciona $ ó %", "info", {
      buttons: {
        monto: {
          text: "$",
          value: "monto"
        },
        porcentaje: {
          text: "%",
          value: "porcentaje"
        }
      }
    }).then(tipo => {
      swal({
        content: {
          element: "input",
          attributes: {
            type: "number"
          }
        },
        text: "Ingresa el descuento en " + tipo,
        buttons: [true, "Aceptar"]
      }).then(descuento => {
        if (tipo == "monto") {
          if (descuento > this.carrito[index].precio) {
            swal(
              "Descuento",
              "El descuento, no puede ser mayor que el precio",
              "error"
            );
            return;
          }
          this.carrito[index].descuento = descuento;
          this.calcularSubTotalCarrito();
        } else {
          if (descuento >= 0 && descuento <= 100) {
            this.carrito[index].descuento =
              this.carrito[index].precio * (descuento / 100);
            this.calcularSubTotalCarrito();
          } else {
            swal(
              "Descuento",
              "El porcentaje debe ser un valor entre 0 y 100",
              "error"
            );
          }
        }
      });
    });
  }

  editarProducto(producto: Producto) {
    this.productoAEditar = producto;
    $("#editarProducto").modal("toggle");
  }

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
        this.paginaActual = pagina.pagina;
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
          this.busquedaActiva=false;
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

  obtenerProductosPorFamilia(familia: string, pagina: number = 1) {    
    this.familiaActual = familia;
    this.busquedaActiva=false;
    $("#productoInput").val("");

    this._productoService.obtenerProductosPorFamilia(familia, pagina).subscribe(
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
    this.totalDescuento = 0;

    this.carrito.forEach(producto => {
      let cantidad = producto.cantidad;
      let precio = producto.precio;
      let descuento = Number(producto.descuento);

      let total = cantidad * precio;
      producto.total = total;

      this.totalCarrito += total;
      if (descuento) {
        this.totalDescuento += descuento;
      }
    });

    this.ivaCarrito = (this.totalCarrito - this.totalDescuento) * 0.16;
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
