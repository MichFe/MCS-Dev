import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';
declare var $:any;

@Component({
  selector: "app-registro-gastos",
  templateUrl: "./registro-gastos.component.html",
  styleUrls: ["./registro-gastos.component.css"]
})
export class RegistroGastosComponent implements OnInit {
  //Variables
  proveedorSeleccionado:any;
  fecha = new Date();
  gastos:any[];

  //Variables de paginado
  paginaActual:number = 1;
  conteoGastos:number;
  totalDePaginas:number;

  //Data
  proveedores: any[] = [];

  //Variables de formulario
  proveedorNombre: string='';
  fechaString:string;
  monto:number;
  descripcion:string;
  categoria:string;

  constructor(
    private _proveedorService:ProveedorService,
    private _gastoService:GastoService
  ) {}

  ngOnInit() {
    this.obtenerGastosPaginados(this.paginaActual);
  }

  obtenerGastosPaginados(pagina:number){
    let desde = (pagina-1) * 10;

    this._gastoService.obtenerGastosPaginados(desde)
      .subscribe(
        (resp:any)=>{
          this.gastos = resp.gastos;
          this.conteoGastos = resp.conteoGastos;
          this.totalDePaginas = Math.ceil(this.conteoGastos/10);
      },
      (error)=>{
        swal(
          "Error al obtener gastos",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

  guardarGasto(){

    let gasto = {
      fecha: this.fecha,
      monto: this.monto,
      descripcion: this.descripcion,
      categoria: this.categoria,
      proveedor: this.proveedorSeleccionado._id,
      pagoCompra: null
    };

    this._gastoService.crearGasto(gasto)
      .subscribe(
        (resp)=>{
          swal(
            "Gasto Guardado",
            "El gasto se ha guardado exitosamente",
            "success"
          );
          this.obtenerGastosPaginados(this.paginaActual);         
      },
      (error)=>{
        swal(
          "Error al guardar gasto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

  abrirEditorDeGasto(){

  }

  eliminarGasto(gastoId){

    swal(
      "Confirmar eliminación",
      "Se eliminará el gasto, ¿Esta seguro de que desea continuar?",
      "warning",
      {
        buttons: {
          aceptar: {
            text: "Aceptar",
            value: true
          },
          cancelar: {
            text: "Cancelar",
            value: false
          }
        }
      }
    ).then(
      (eliminar) => {
        if (eliminar) {
          this._gastoService.eliminarGasto(gastoId)
            .subscribe(
              (resp) => {
                swal(
                  "Gasto Eliminado",
                  "El gasto se ha eliminado correctamente",
                  "success"
                );

                this.obtenerGastosPaginados(this.paginaActual);
              },
              (error) => {
                swal(
                  "Error al Eliminar Gasto",
                  error.error.mensaje + " | " + error.error.errors.message,
                  "error"
                );
              });
        } else {
          return;
        }
      });
  }

// Funciones de paginado
  paginaSiguiente(){
    if(this.paginaActual*10 >= this.conteoGastos){
      return;
    }
    this.paginaActual+=1;
    this.obtenerGastosPaginados(this.paginaActual);
  }

  paginaAnterior(){
    if(this.paginaActual===1){
      return;
    }
    this.paginaActual-=1;
    this.obtenerGastosPaginados(this.paginaActual);
  }

// Funciones para buscador de proveedores
  buscarProveedor() {
    let termino = this.proveedorNombre;

    if (termino.length === 0) {
      this.proveedores = [];
      return;
    }

    if (termino.length < 3) {
      return;
    }
    this._proveedorService.buscarProveedor(termino).subscribe(
      (resp: any) => {
        this.proveedores = resp.proveedor;
      },
      (error) => {
        swal(
          "Error al Buscar Proveedor",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  abrirRegistroDeProveedor(evento) {
    $("#modalNuevoProveedor").modal('toggle');
  }

  seleccionarProveedor(proveedor){
    this.proveedorSeleccionado = proveedor;
    this.proveedorNombre = proveedor.nombre;
    this.proveedores = [];
  }

}
