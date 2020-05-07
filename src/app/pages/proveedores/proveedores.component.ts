import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import { OrdenCompraService } from 'src/app/services/ordenCompra/orden-compra.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';

@Component({
  selector: "app-proveedores",
  templateUrl: "./proveedores.component.html",
  styleUrls: ["./proveedores.component.css"]
})
export class ProveedoresComponent implements OnInit {
  //Variables
  proveedorSeleccionado;
  totalDeComprasaProveedorSeleccionado:number;
  totalDeGastosProveedorSeleccionado:number;

  nombreProveedor: string;
  telefonoProveedor: string;
  direccionProveedor: string;
  emailProveedor: string;

  //Variables Buscador
  proveedorNombre: string;

  //Data
  proveedores: any[] = [];
  comprasProveedor:any[] = [];
  paginaComprasProveedor = 1;
  gastosProveedor:any[] = [];
  paginaGastosProveedor = 1;

  constructor(
    private _proveedorService: ProveedorService,
    private _comprasService: OrdenCompraService,
    private _gastosService: GastoService
    ) {}

  ngOnInit() {
    this.obtenerProveedores();
  }

  obtenerTotalComprasProveedor(proveedor){

    this._comprasService.obtenerTotalComprasProveedor(proveedor._id).subscribe(
      (resp:any)=>{
        this.totalDeComprasaProveedorSeleccionado = resp.totalComprasProveedor;
    },
    (error)=>{
      swal(
        `Error al obtener compras`,
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });

  }

  obtenerTotalGastosProveedor(proveedor){
    this._gastosService.obtenerTotalDeGastosPorProveedor(proveedor).subscribe(
      (resp:any)=>{
        this.totalDeGastosProveedorSeleccionado = resp.totalGastosProveedor;
    },
    (error)=>{
      swal(
        `Error al obtener compras`,
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });
  }

  comprasPaginaAnterior(){
    if(this.paginaComprasProveedor==1){
      return;
    }

    this.paginaComprasProveedor - 1;
    this.obtenerComprasDeUnProveedor(this.proveedorSeleccionado);
  }

  comprasPaginaSiguiente(){
    this.paginaComprasProveedor += 1;

    let desde = (this.paginaComprasProveedor - 1) * 10;

    this._comprasService.obtenerComprasProveedor(this.proveedorSeleccionado._id, desde).subscribe(
      (resp: any) => {
        if (resp.compras.length > 0) {
          this.comprasProveedor = resp.compras;
        } else {
          this.paginaComprasProveedor -= 1;
        }

      },
      (error) => {
        swal(
          `Error al obtener compras`,
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

  obtenerComprasDeUnProveedor(proveedor){
    let desde = (this.paginaComprasProveedor - 1)*10; 
    this._comprasService.obtenerComprasProveedor(proveedor._id, desde).subscribe(
      (resp:any)=>{
          this.comprasProveedor = resp.compras;
      },
      (error)=>{
        swal(
          `Error al obtener compras`,
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

  gastosPaginaAnterior(){
    if (this.paginaGastosProveedor == 1) {
      return;
    }

    this.paginaGastosProveedor -= 1;
    
    this.obtenerGastosDeUnProveedor(this.proveedorSeleccionado);
  }

  gastosPaginaSiguiente(){
    this.paginaGastosProveedor += 1;

    let desde = (this.paginaGastosProveedor - 1) * 10;

    this._gastosService.obtenerGastosPorProveedor(this.proveedorSeleccionado, desde).subscribe(
      (resp: any) => {
        if (resp.gastosProveedor.length > 0) {
          this.gastosProveedor = resp.gastosProveedor;
        } else {
          this.paginaGastosProveedor -= 1;
        }

      },
      (error) => {
        swal(
          `Error al obtener gastos`,
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
      
      
  }

  obtenerGastosDeUnProveedor(proveedor){
    let desde = (this.paginaGastosProveedor - 1)*10;
    
    this._gastosService.obtenerGastosPorProveedor(proveedor, desde).subscribe(
      (resp:any)=>{
        this.gastosProveedor = resp.gastosProveedor
    },
    (error)=>{
      swal(
        `Error al obtener gastos`,
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });

  }

  filtrarProveedores(){
    let nombreProveedor: string;
    let termino: string;
    termino = this.proveedorNombre.trim();
    termino = termino.toUpperCase();

    //Si el campo busqueda tiene 0 caracteres, volvemos a llamar a todos los cientes
    if (this.proveedorNombre.length == 0) {
      this.obtenerProveedores();
      this.comprasProveedor=[];
      this.gastosProveedor=[];
      this.paginaComprasProveedor = 1;
      this.paginaGastosProveedor = 1;
    }

    //Si el campo de busqueda tiene menos de 3 caracteres no se ejecuta la busqueda
    if (this.proveedorNombre.length < 3) {
      return;
    }

    let proveedoresFiltrados = [];

    this.proveedores.forEach((proveedor, i) => {

      nombreProveedor = proveedor.nombre;
      nombreProveedor = nombreProveedor.trim();
      nombreProveedor = nombreProveedor.toUpperCase();

      if (nombreProveedor.includes(termino)) {

        proveedoresFiltrados.push(proveedor);
      }
    });
    this.proveedores = proveedoresFiltrados;
  }

  obtenerProveedores() {
    this._proveedorService.obtenerTodosLosProveedores().subscribe(
      (resp: any) => {
        this.proveedores = resp.proveedores;
      },
      error => {
        swal(
          `Error al obtener proveedores`,
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  actualizarProveedor() {
    if (!this.proveedorSeleccionado._id) {
      return;
    }

    let proveedorActualizado = {
      nombre: this.nombreProveedor,
      telefono: this.telefonoProveedor,
      direccion: this.direccionProveedor,
      email: this.emailProveedor
    };

    this._proveedorService
      .actualizarProveedor(this.proveedorSeleccionado._id, proveedorActualizado)
      .subscribe(
        (resp: any) => {
          this.obtenerProveedores();
          this.proveedorSeleccionado = resp.proveedor;

          this.nombreProveedor = resp.proveedor.nombre;
          this.telefonoProveedor = resp.proveedor.telefono;
          this.direccionProveedor = resp.proveedor.direccion;
          this.emailProveedor = resp.proveedor.email;

          swal(
            "Proveedor actualizado correctamente",
            `Se han actualizado correctamente los datos del proveedor: ${resp.proveedor.nombre}`,
            "success"
          );
        },
        error => {
          swal(
            `Error al actualizar proveedor`,
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );
  }

  seleccionarProveedor(proveedor) {
    this.proveedorSeleccionado = proveedor;

    this.nombreProveedor = proveedor.nombre;
    this.telefonoProveedor = proveedor.telefono;
    this.direccionProveedor = proveedor.direccion;
    this.emailProveedor = proveedor.email;

    this.paginaComprasProveedor = 1;
    this.paginaGastosProveedor = 1;

    this.obtenerComprasDeUnProveedor(proveedor);
    this.obtenerTotalComprasProveedor(proveedor);

    this.obtenerGastosDeUnProveedor(proveedor);
    this.obtenerTotalGastosProveedor(proveedor);
  }
}
