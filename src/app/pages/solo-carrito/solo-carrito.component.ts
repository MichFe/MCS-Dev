import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { bind } from '@angular/core/src/render3/instructions';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
declare var $:any;

@Component({
  selector: "app-solo-carrito",
  templateUrl: "./solo-carrito.component.html",
  styleUrls: ["./solo-carrito.component.css"]
})
export class SoloCarritoComponent implements OnInit {

  @Input()
  carrito = [];

  @Input()
  modalCotizacion:boolean=false;

  @Output() actualizarTotales:EventEmitter<any> = new EventEmitter();

  //Variables
  subTotalCarrito: number;
  totalDescuento: number;
  ivaCarrito: number;
  totalCarrito: number;

  totales={};

  constructor(
    public _cotizacionService: CotizacionService,
    public _carritoService: CarritoService
  ) {}

  ngOnInit() {
    if(this.modalCotizacion){
      this.carrito=this._cotizacionService.carrito;
    }
  }

  agregarProductosACotizacion(){

    this._cotizacionService.agregarProductosACotizacion(this.carrito);
    this._cotizacionService.vaciarCarrito();

    $("#catalogoModal").modal("toggle");
    $("#catalogoModal").on("hidden.bs.modal", function(event) {
      // Open your second one in here
      $("#cotizacion").modal("toggle");
      $("#catalogoModal").off("hidden.bs.modal");
    });



  }

  cambiarNombre(indiceCarrito) {

    if(this.modalCotizacion){
      $("#catalogoModal").modal("toggle");
      $("#catalogoModal").on("hidden.bs.modal", function (event) {
        $("#catalogoModal").off("hidden.bs.modal");
        ///
        swal({
          content: {
            element: "input"
          },
          text: "Asigna un nuevo nombre",
          buttons: [true, "Aceptar"]
        })
          .then(nombre => {
            if (!nombre) {
              $("#catalogoModal").modal("toggle");
              return;
            }
            this.carrito[indiceCarrito].nombre = nombre;
            $("#catalogoModal").modal("toggle");
          })
          .catch();
      }.bind(this));
    }else{
      $("#modalDetalleVenta").modal("toggle");
      $("#modalDetalleVenta").on("hidden.bs.modal", function (event) {
        $("#modalDetalleVenta").off("hidden.bs.modal");
        ///
        swal({
          content: {
            element: "input"
          },
          text: "Asigna un nuevo nombre",
          buttons: [true, "Aceptar"]
        })
          .then(nombre => {
            if (!nombre) {
              $("#modalDetalleVenta").modal("toggle");
              return;
            }
            this.carrito[indiceCarrito].nombre = nombre;
            $("#modalDetalleVenta").modal("toggle");
          })
          .catch();
      }.bind(this));
    }

   

    

  }

  cambiarPrecio(indiceCarrito) {

    if(this.modalCotizacion){
      $("#catalogoModal").modal("toggle");
      $("#catalogoModal").on("hidden.bs.modal", function (event) {
        $("#catalogoModal").off("hidden.bs.modal");
        ///

        swal({
          content: {
            element: "input"
          },
          text: "Asigna un nuevo precio",
          buttons: [true, "Aceptar"]
        })
          .then(precio => {
            if (!precio) {
              $("#catalogoModal").modal("toggle");
              return;
            }
            this.carrito[indiceCarrito].precio = Number(precio);
            this.calcularSubTotalCarrito();
            $("#catalogoModal").modal("toggle");
          })
          .catch();

      }.bind(this));

    }else{
      $("#modalDetalleVenta").modal("toggle");
      $("#modalDetalleVenta").on("hidden.bs.modal", function (event) {
        $("#modalDetalleVenta").off("hidden.bs.modal");
        ///

        swal({
          content: {
            element: "input"
          },
          text: "Asigna un nuevo precio",
          buttons: [true, "Aceptar"]
        })
          .then(precio => {
            if (!precio) {
              $("#modalDetalleVenta").modal("toggle");
              return;
            }
            this.carrito[indiceCarrito].precio = Number(precio);
            this.calcularSubTotalCarrito();
            $("#modalDetalleVenta").modal("toggle");
          })
          .catch();

      }.bind(this));
    }
    
    

    
  }

  agregarDescuento(index) {

    if(this.modalCotizacion){
      $("#catalogoModal").modal("toggle");
      $("#catalogoModal").on("hidden.bs.modal", function (event) {
        $("#catalogoModal").off("hidden.bs.modal");
        // Open your second one in here

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
                ).then(() => {
                  $("#catalogoModal").modal("toggle");
                  return;
                });

              }

              this.carrito[index].descuento = Number(descuento);
              this.calcularSubTotalCarrito();
              $("#catalogoModal").modal("toggle");

            } else {
              if (descuento >= 0 && descuento <= 100) {
                this.carrito[index].descuento =
                  this.carrito[index].precio * (descuento / 100);
                this.calcularSubTotalCarrito();
                $("#catalogoModal").modal("toggle");
              } else {
                swal(
                  "Descuento",
                  "El porcentaje debe ser un valor entre 0 y 100",
                  "error"
                ).then(() => {
                  $("#catalogoModal").modal("toggle");
                });
              }
            }
          });
        });

      }.bind(this));
    }else{
      $("#modalDetalleVenta").modal("toggle");
      $("#modalDetalleVenta").on("hidden.bs.modal", function (event) {
        $("#modalDetalleVenta").off("hidden.bs.modal");
        // Open your second one in here

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
                ).then(() => {
                  $("#modalDetalleVenta").modal("toggle");
                  return;
                });

              }

              this.carrito[index].descuento = Number(descuento);
              this.calcularSubTotalCarrito();
              $("#modalDetalleVenta").modal("toggle");

            } else {
              if (descuento >= 0 && descuento <= 100) {
                this.carrito[index].descuento =
                  this.carrito[index].precio * (descuento / 100);
                this.calcularSubTotalCarrito();
                $("#modalDetalleVenta").modal("toggle");
              } else {
                swal(
                  "Descuento",
                  "El porcentaje debe ser un valor entre 0 y 100",
                  "error"
                ).then(() => {
                  $("#modalDetalleVenta").modal("toggle");
                });
              }
            }
          });
        });

      }.bind(this));
    }

    

    
  }

  calcularSubTotalCarrito() {
    this.subTotalCarrito = 0;
    this.totalDescuento = 0;
    this.ivaCarrito=0;
    this.totalCarrito=0;

    this.carrito.forEach(producto => {
      let cantidad = Number(producto.cantidad);
      let precio = Number(producto.precio);
      let descuento = (!producto.descuento)?0:Number(producto.descuento);

      let total = cantidad * (precio );
      producto.total = total;

      this.subTotalCarrito += total;
      if (descuento) {
        this.totalDescuento += (descuento * cantidad);
      }
    });

    this.ivaCarrito = (this.subTotalCarrito - this.totalDescuento) * 0.16;
    this.totalCarrito=(this.subTotalCarrito - this.totalDescuento + this.ivaCarrito);

    this.totales ={
      subtotal: this.subTotalCarrito,
      descuento: this.totalDescuento,
      iva: this.ivaCarrito,
      total: this.totalCarrito
    };

    this.actualizarTotales.emit(this.totales);
    
  }

  asignarCantidadManualmente(i) {

    if(this.modalCotizacion){
      $("#catalogoModal").modal("toggle");
      $("#catalogoModal").on("hidden.bs.modal", function (event) {
        // Open your second one in here
        $("#catalogoModal").off("hidden.bs.modal");
        swal({
          content: {
            element: "input"
          },
          text: "Asigna una cantidad",
          buttons: [true, "Aceptar"]
        })
          .then((cantidad) => {

            if (!cantidad) {
              $("#catalogoModal").modal("toggle");
              return;
            }

            this.carrito[i].cantidad = Number(cantidad);

            //Actualizamos subtotales de cada producto en el carrito
            this.calcularSubTotalCarrito();
            $("#catalogoModal").modal("toggle");
          })
          .catch();


      }.bind(this));
    }else{
      $("#modalDetalleVenta").modal("toggle");
      $("#modalDetalleVenta").on("hidden.bs.modal", function (event) {
        // Open your second one in here
        $("#modalDetalleVenta").off("hidden.bs.modal");
        swal({
          content: {
            element: "input"
          },
          text: "Asigna una cantidad",
          buttons: [true, "Aceptar"]
        })
          .then((cantidad) => {

            if (!cantidad) {
              $("#modalDetalleVenta").modal("toggle");
              return;
            }

            this.carrito[i].cantidad = Number(cantidad);

            //Actualizamos subtotales de cada producto en el carrito
            this.calcularSubTotalCarrito();
            $("#modalDetalleVenta").modal("toggle");
          })
          .catch();


      }.bind(this));
    }
    
   

    
  }

  eliminarElementoDelCarrito(i) {
    this.carrito.splice(i, 1);
    this.calcularSubTotalCarrito();
  }

}
