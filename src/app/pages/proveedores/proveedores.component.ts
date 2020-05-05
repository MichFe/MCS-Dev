import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';

@Component({
  selector: "app-proveedores",
  templateUrl: "./proveedores.component.html",
  styleUrls: ["./proveedores.component.css"]
})
export class ProveedoresComponent implements OnInit {
  //Variables
  proveedorSeleccionado;

  nombreProveedor: string;
  telefonoProveedor: string;
  direccionProveedor: string;
  emailProveedor: string;

  //Variables Buscador
  proveedorNombre: string;

  //Data
  proveedores: any[] = [];

  constructor(private _proveedorService: ProveedorService) {}

  ngOnInit() {
    this.obtenerProveedores();
  }

  filtrarProveedores(){
    let nombreProveedor: string;
    let termino: string;
    termino = this.proveedorNombre.trim();
    termino = termino.toUpperCase();

    //Si el campo busqueda tiene 0 caracteres, volvemos a llamar a todos los cientes
    if (this.proveedorNombre.length == 0) {
      this.obtenerProveedores();
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
  }
}
