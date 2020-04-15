import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';

declare var $:any;

@Component({
  selector: "app-solo-catalogo-productos",
  templateUrl: "./solo-catalogo-productos.component.html",
  styleUrls: ["./solo-catalogo-productos.component.css"]
})
export class SoloCatalogoProductosComponent implements OnInit {

  //Variables
  productoNombre: string;
  busquedaActiva: boolean = false;
  familiaActual: string;
  totalProductos: number;
  paginaActual: number;

  //Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  //Data
  productos = [];
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
    { nombre: "Bases de Cama" },
    { nombre: "Cuadros" },
    { nombre: "Tapetes" },
    { nombre: "Accesorios" }
  ];

  constructor(
    private _productoService: ProductoService,
    private _usuarioService: UsuarioService,
    private http: HttpClient,
    private _cotizacionService: CotizacionService
  ) {}

  ngOnInit() {}

  buscarProducto(termino) {
    if (this.productoNombre.length == 0) {
      this.productos = [];
      this.busquedaActiva = false;
      return;
    }

    if (this.productoNombre.length < 3) {
      return;
    }

    this._productoService.buscarProducto(termino).subscribe(
      (resp: any) => {
        this.busquedaActiva = true;
        this.familiaActual = "";
        this.productos = resp.producto;
        this.totalProductos = this.productos.length;
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

  obtenerProductosPorFamilia(familia: string, pagina: number = 1) {
    this.familiaActual = familia;
    this.busquedaActiva = false;
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

  agregarACarrito(producto) {
    producto.cantidad=1;
    producto.descuento=0;
    let clonedProduct = {};
    Object.assign(clonedProduct,producto);
    
    this._cotizacionService.carrito.push(clonedProduct);
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

  cargarProductosPagina(pagina) {
    this._productoService
      .obtenerProductosPorFamilia(this.familiaActual, pagina)
      .subscribe(
        (resp: any) => {
          this.busquedaActiva = false;
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

  paginaSiguiente() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina * 10 >= this.totalProductos) {
      return;
    }
    this.cargarProductosPagina(paginaActual.pagina + 1);
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
}
