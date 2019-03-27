import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ClienteService } from 'src/app/services/clientes/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { ProyectoService } from 'src/app/services/proyectos/proyecto.service';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { bind } from '@angular/core/src/render3/instructions';
import { VentasService } from 'src/app/services/ventas/ventas.service';
import { CobroService } from 'src/app/services/cobros/cobro.service';

declare var $: any;

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit,OnChanges {

  @Input()
  venta:any={};

  @Output() resetearVenta:EventEmitter<any> = new EventEmitter();

  @Output() recargarTablaVentas: EventEmitter<any> = new EventEmitter();

  //Variables de formulario
  clientes: any[] = [];
  cliente:any;
  clienteNombre:string;
  proyectos: any[] = [];
  proyectoSeleccionado: string;
  seleccionIva: boolean = false;
  tipoPago: string;
  carrito=[];
  modalCerradoPorUsuario=false;
  fechaString: string;

  subtotal:number;
  totalDescuento:number;
  total:number;
  iva:number;
  cobros:any[];
  fecha:Date = new Date();

  constructor(
    private _clienteService:ClienteService,
    private _proyectoService:ProyectoService,
    private _carritoService: CarritoService,
    private _ventasService:VentasService,
    private _cobrosService:CobroService
  ) { 
    
  }

  ngOnInit() {
    this.fecha = new Date();
    this.cargarFechaString();
  }

  ngOnChanges(changes): void {


    if (this.venta.cliente) {

      this.clienteNombre = this.venta.cliente.nombre;
      this.proyectoSeleccionado = this.venta.proyecto;
      this.tipoPago = this.venta.tipoDePago;
      (this.venta.iva != 0) ? this.seleccionIva = true : this.seleccionIva = false;

      let objTemp = {};

      this.carrito = [];
      this.venta.carrito.forEach(producto => {
        objTemp = Object.assign({}, producto);
        this.carrito.push(objTemp);
      });


      this.cliente = this.venta.cliente;
      this.cargarProyectosDelCliente();

      this.subtotal = this.venta.subtotal;
      this.iva = this.venta.iva;
      this.total = this.venta.total;

      this.totalDescuento = 0;

      this.carrito.forEach(producto => {
        if (producto.descuento) {
          this.totalDescuento += (producto.descuento*producto.cantidad);
        }
      });

      this.obtenerCobros(this.venta._id);

      this.fecha = new Date(this.venta.fecha);      
      this.cargarFechaString();
      

    } else {

      this.clienteNombre = '';
      this.proyectoSeleccionado = '';
      this.tipoPago = '';
      this.seleccionIva = false;
      this.carrito = [];


      this.cliente = {};
      this.proyectos = [];
      this.subtotal = 0;
      this.iva = 0;
      this.total = 0;
      this.totalDescuento = 0;

      this.cobros=[];
      this.fecha = new Date();
      this.cargarFechaString();

    }

    



  }

  recargarVenta(){
    this._ventasService.obtenerVentaPorId(this.venta._id)
      .subscribe(
        (resp:any)=>{
          this.venta=resp.venta;
        },
        (error)=>{
          swal(
            "Error al recargar venta",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });
  }


  obtenerCobros(ventaId) {

    if (this.cobros) {
      this.cobros = null;

      return;

    }

    this._cobrosService.obtenerCobro(ventaId)
      .subscribe(
        (resp: any) => {

          this.cobros = resp.pagos;

        });

  }

  eliminarPago(pago) {

    swal(
      "Confirmar eliminación",
      "Se eliminará el pago, ¿Esta seguro de que desea continuar?",
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

          this._cobrosService.eliminarCobro(pago._id)
            .subscribe(
              (resp) => {
                
                this.recargarVenta();
                this.obtenerCobros(this.venta._id);
                this.recargarTablaVentas.emit();
                swal(
                  "Pago Eliminado",
                  "El pago fue eliminado exitosamente",
                  "success"
                );
              },
              (error) => {
                swal(
                  "Error al eliminar pago",
                  error.error.mensaje + " | " + error.error.errors.message,
                  "error"
                );
              });

        } else {
          return;
        }
      });



  }

  resetearModal(){

    this.cobros=null;
    this.resetearVenta.emit({});  

  }



  abrirRegistroDeCliente(event) {
    event.preventDefault();
    event.stopPropagation();

    $("#modalDetalleVenta").modal("toggle");
    $("#modalDetalleVenta").on("hidden.bs.modal", function (event) {
      // Open your second one in here
      $("#nuevoCliente").modal("toggle");
      $("#modalDetalleVenta").off("hidden.bs.modal");
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

  asignarTotales(totales){
        
    this.subtotal=totales.subtotal;
    this.totalDescuento = totales.descuento;
    (this.seleccionIva)?this.iva=totales.iva:this.iva=0;
    this.total=this.subtotal-this.totalDescuento+this.iva;

  }

  toggleIva(){

    if(this.seleccionIva){
      this.iva=(this.subtotal-this.totalDescuento)*0.16;
      this.total = this.subtotal - this.totalDescuento + this.iva;
    }else{
      this.iva=0;
      this.total = this.subtotal - this.totalDescuento + this.iva;
    }


  }

  cambiarFecha() {
    this.fecha = new Date();

    let horas = this.fecha.getHours();
    let minutos = this.fecha.getMinutes();

    let fechaArray = this.fechaString.split('-');
    this.fecha = new Date(Number(fechaArray[0]), Number(fechaArray[1]) - 1, Number(fechaArray[2]), horas, minutos);

  }

  cargarFechaString() {
    
    let year = this.fecha.getFullYear();
    let mes = this.fecha.getMonth();
    let dia = this.fecha.getDate();
    mes = mes + 1;
    let mesString: string;
    let diaString:string;

    if (mes < 10) {
      mesString = '0' + mes;
    } else {
      mesString = String(mes);
    }

    if(dia < 10){
      diaString = '0' + dia;
    }else{
      diaString=String(dia);
    }


    this.fechaString = `${year}-${mesString}-${diaString}`;
    
    

  }

  actualizarVenta(){

    let ventaActualizada={
      cliente:this.cliente._id,
      proyecto:this.proyectoSeleccionado,
      tipoDePago:this.tipoPago,
      iva:this.iva,
      carrito:this.carrito,
      subtotal:this.subtotal,
      total:this.total,
      saldoPendiente: this.venta.saldoPendiente,
      montoPagado: this.venta.montoPagado,
      estatus: this.venta.estatus,
      fecha: this.fecha
    };

    if (this.total>this.venta.total){

      ventaActualizada.saldoPendiente= this.venta.saldoPendiente+(this.total-this.venta.total);
      ventaActualizada.saldoPendiente= Number(ventaActualizada.saldoPendiente.toFixed(2));
      ventaActualizada.estatus = 'Saldo Pendiente';
      this.llamarActualizacionDeVenta(ventaActualizada);
      return;

    }else{      

      if( (this.venta.saldoPendiente-(this.venta.total-this.total))>=0){
        
        ((this.venta.saldoPendiente - (this.venta.total - this.total)) == 0)?ventaActualizada.estatus = 'Liquidada':ventaActualizada.estatus = 'Saldo Pendiente';

        ventaActualizada.saldoPendiente=this.venta.saldoPendiente-(this.venta.total-this.total);
        ventaActualizada.saldoPendiente= Number(ventaActualizada.saldoPendiente.toFixed(2));
        this.llamarActualizacionDeVenta(ventaActualizada);
        return;

      }else{        

        let excedente = ((this.venta.saldoPendiente - (this.venta.total - this.total)) * -1);

        excedente=Number(excedente.toFixed(2));

        let excedenteString = excedente.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        swal(
          'Nuevo monto es menor al total pagado',
          `Los cambios en la venta generan un saldo a favor del cliente, desea devolver al cliente: $${excedenteString} ?`,
          'warning',
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
          (actualizar) => {
            if (actualizar) {

              ventaActualizada.montoPagado = ventaActualizada.montoPagado-excedente;
              ventaActualizada.montoPagado=Number(ventaActualizada.montoPagado.toFixed(2));
              ventaActualizada.saldoPendiente=0;              
              ventaActualizada.estatus = 'Liquidada';
              this.llamarActualizacionDeVenta(ventaActualizada,excedente);

            } else {
              
              return;

            }
          });


      }
    }
  }

  llamarActualizacionDeVenta(ventaActualizada, devolucion:number=0){
    this._ventasService.actualizarVenta(this.venta._id, ventaActualizada, devolucion)
      .subscribe(
        (resp) => {

          this.recargarTablaVentas.emit();
          $('#modalDetalleVenta').modal('toggle');

          swal(
            "Venta actualizada",
            "Venta actualizada correctamente",
            "success"
          );

        },
        (error) => {
          swal(
            "Error al actualizar venta",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );   
  }

  eliminarVenta(id){

    swal(
      "Confirmar eliminación",
      "Se eliminará la venta, ¿Esta seguro de que desea continuar?",
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
          this._ventasService.eliminarVenta(id)
            .subscribe(
            (resp: any) => {

              this.recargarTablaVentas.emit();

              swal(
                "Venta eliminada",
                "La venta: " + resp.venta._id + ", se ha eliminado exitosamente",
                "success"
              );

              $("#modalDetalleVenta").modal("toggle");

            },
            (error) => {
              swal(
                "Error al eliminar venta",
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            }
          );
        } else {
          return;
        }
      });

  }

  
}
