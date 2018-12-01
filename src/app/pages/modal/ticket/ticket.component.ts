import { Component, OnInit, Input } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { VentasService } from 'src/app/ventas/ventas.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { ClienteService } from 'src/app/services/clientes/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { ProyectoService } from 'src/app/services/proyectos/proyecto.service';

declare var $: any;

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"]
})
export class TicketComponent implements OnInit {
  @Input()
  carrito: any;

  @Input()
  totalCarrito: number;

  @Input()
  totalDescuento: number;

  @Input()
  iva: number;

  //Variables
  tipoPago: string;
  seleccionIva: boolean = false;
  efectivo: number;
  clienteNombre: string;
  cliente: Cliente;
  clientes: any[] = [];
  proyectos: any[] = [];
  proyectoSeleccionado: any = {};
  anticipo: boolean = false;
  saldo: number = 0;
  ventaConfirmada:boolean = false;

  fecha = new Date();

  constructor(
    public _carritoService: CarritoService,
    public _ventasService: VentasService,
    public _usuarioService: UsuarioService,
    public _clienteService: ClienteService,
    public _proyectoService: ProyectoService
  ) {}

  ngOnInit() {
    // this.carrito=this._carritoService.carrito;
  }

  abrirRegistroDeCliente(event) {
    event.preventDefault();
    event.stopPropagation();

    $("#ticketVenta").modal("toggle");
    $("#ticketVenta").on("hidden.bs.modal", function(event) {
      // Open your second one in here
      $("#nuevoCliente").modal("toggle");
      $("#ticketVenta").off("hidden.bs.modal");
    });
  }

  seleccionarcliente(cliente: Cliente) {
    this.cliente = cliente;
    this.clienteNombre = cliente.nombre;
    this.clientes = [];

    this.cargarProyectosDelCliente();
  }

  cargarProyectosDelCliente() {
    this._proyectoService
      .getProyectos(this.cliente._id, 0)
      .subscribe((resp: any) => {
        this.proyectos = resp.proyectos;
      });
  }


  buscarCliente() {
    let termino = this.clienteNombre;

    if (termino.length === 0) {
      this.clientes = [];
      return;
    }

    if (termino.length < 3) {
      return;
    }
    this._clienteService.buscarCliente(termino).subscribe(
      (resp: any) => {
        this.clientes = resp.cliente;
      },
      error => {

        swal(
          "Error al buscar Cliente",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerCarrito() {
    this.carrito = this._carritoService.carrito;
  }

  enviarCarrito() {
    this._carritoService.carrito = this.carrito;
  }

  resetearModal() {
    this.ventaConfirmada=false;
  }

  imprimirTicket() {

    if(!this.ventaConfirmada){
      return;
    }

    let ticket = document.getElementById("documento-ticket");
    let domClone = ticket.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

  generarVenta() {

    if (!this.cliente) {
      swal(
        "Cliente",
        "Favor de seleccionar un cliente o registrar uno nuevo",
        "warning"
      );
      return;
    }

    if (!this.tipoPago) {
      swal(
        "Metodo de pago",
        "No se ha seleccionado un método de pago",
        "warning"
      );
      return;
    }

    if (!this.efectivo) {
      swal("Monto Recibido", "Favor de ingresar el monto recibido", "warning");
      return;
    }

    this.fecha = new Date();

    let venta = {
      subtotal: this.totalCarrito,
      cliente: this.cliente._id,
      iva: 0,
      total: this.totalCarrito,
      vendedor: this._usuarioService.id,
      fecha: this.fecha,
      carrito: this.carrito,
      tipoDePago: this.tipoPago,
      montoPagado: null,
      saldoPendiente: 0,
      estatus: "Liquidada",
      proyecto: this.proyectoSeleccionado
    };

    if (this.seleccionIva) {
      venta.iva = this.iva;
      venta.total = this.totalCarrito + this.iva;
    }

    venta.montoPagado = this.efectivo;

    if (this.efectivo < venta.total) {
      swal(
        "Anticipo",
        "El monto recibido es menor que el monto total, desea realizar la venta con anticipo?",
        "warning",
        {
          buttons: {
            monto: {
              text: "Sí",
              value: true
            },
            porcentaje: {
              text: "No",
              value: false
            }
          }
        }
      ).then(anticipo => {
        if (anticipo) {
          venta.saldoPendiente = venta.total - venta.montoPagado;
          this.saldo = venta.saldoPendiente;
          venta.estatus = "Saldo Pendiente";
          this.anticipo = anticipo;

          this._ventasService.generarVenta(venta).subscribe(
            (resp: any) => {
              this.ventaConfirmada=true;
            swal(
              "Venta exitosa",
              "La venta se a registrado exitosamente",
              "success"
            );
          },
          (error)=>{
            swal(
              "Error al registrar Venta",
              error.error.mensaje + " | " + error.error.errors.message,
              "error"
            );
          });

          return;
        } else {
          this.anticipo = anticipo;
          return;
        }
      });
    } else {
      // console.log(venta);
      this._ventasService.generarVenta(venta).subscribe(
        (resp: any) => {
          this.ventaConfirmada = true;
          swal(
            "Venta exitosa",
            "La venta se ha registrado exitosamente",
            "success"
          )
      },
      (error)=>{
        swal(
          "Error al registrar Venta",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
    }
  }
}
