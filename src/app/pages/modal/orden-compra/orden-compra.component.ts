import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import { OrdenCompraService } from 'src/app/services/ordenCompra/orden-compra.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import swal from 'sweetalert';
import { RequisicionesService } from 'src/app/services/requisiciones/requisiciones.service';
declare var $:any;

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.css']
})
export class OrdenCompraComponent implements OnInit {

  //Variables
  fechaEntrega = new Date(); 
  
  //Data
  proveedores:any[] = [];
  proveedor:any;

  //Variables de formulario
  proveedorNombre:string = '';
  costo:number = 0;
  fechaEntregaString:string;
  comentario:string = '';
  descripcionCompra:string = '';
  tipoDeProveedor:string;

  //Requisicion
  @Input()
  requisiciones:any[];

  @Input()
  compra:any;

  @Output()
  actualizarData:EventEmitter<any>=new EventEmitter();

  @Output()
  deseleccionarRequisicion:EventEmitter<any>=new EventEmitter();


  constructor(
    private _proveedorService:ProveedorService,
    private _compraService:OrdenCompraService,
    private _usuarioService: UsuarioService,
    private _requisicionService: RequisicionesService
  ) { }

  ngOnInit() {
    
  }

  abrirModalNotaDeCompra(){

    $("#modalOrdenDeCompra").modal("toggle");
    $("#modalOrdenDeCompra").on("hidden.bs.modal", function (event) {
      // Open your second one in here
      $("#modalNotaCompra").modal("toggle");
      $("#modalOrdenDeCompra").off("hidden.bs.modal");

      $("#modalNotaCompra").on("hidden.bs.modal", function(event) {
        $("#modalOrdenDeCompra").modal("toggle");
        $("#modalNotaCompra").off("hidden.bs.modal");
      });

    });


  }

  confirmarRecepcionDeProducto(){
    let compra={
      _id: this.compra._id,
      estatusPedido: 'Recibido'
    };

    this._compraService.actualizarCompra(compra)
      .subscribe((resp:any)=>{
        let fecha=new Date();

        let requisicionesActualizadasCorrectamente = 0;
        let requisicionesConErrorAlActualizar = 0;

        let numeroDeRequisiciones=resp.compra.requisiciones.length;
        resp.compra.requisiciones.forEach( (requisicion, index) => {

          requisicion.estatus = 'Recibido';
          requisicion.fechaReciboMercancia = fecha;
          requisicion.productoRecibido = true;
          
          this._requisicionService.actualizarRequisicion(requisicion)
            .subscribe((resp: any) => {

              requisicionesActualizadasCorrectamente+=1;

              //Ultima requisicion
              if(index>=(numeroDeRequisiciones-1)){
                
                swal(
                  "Confirmación de recepción de producto",
                  `Requisiciones actualizadas: ${ requisicionesActualizadasCorrectamente }, errores: ${requisicionesConErrorAlActualizar}`,
                  "warning"
                );
                this.refrescarTablas();
                $('#modalOrdenDeCompra').modal('toggle');
                
                this.resetearModal();

              }

            },
              (error) => {

                requisicionesConErrorAlActualizar+=1;

                if (index >= (numeroDeRequisiciones-1)) {

                  swal(
                    "Confirmación de recepción de producto",
                    `Requisiciones actualizadas: ${requisicionesActualizadasCorrectamente}, errores: ${requisicionesConErrorAlActualizar}`,
                    "warning"
                  );
                  this.refrescarTablas();
                  $('#modalOrdenDeCompra').modal('toggle');

                  this.resetearModal();

                }

              });

        });

        
      },
      (error)=>{
        swal(
          "Error al actualizar Compra",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });

  }

  abrirModalPago(){

    $("#modalOrdenDeCompra").modal("toggle");
    $("#modalOrdenDeCompra").on("hidden.bs.modal", function (event) {
      // Open your second one in here
      $("#modalPago").modal("toggle");
      $("#modalOrdenDeCompra").off("hidden.bs.modal");

      $('#modalPago').on('hidden.bs.modal', function(event){
        $('#modalOrdenDeCompra').modal('toggle');
        $('#modalPago').off('hidden.bs.modal');
      });

    });

  }

  setearCompra(compra){

    this.proveedor=compra.proveedor;
    this.proveedorNombre=this.proveedor.nombre;
    this.costo=compra.costoTotal;
    this.fechaEntrega = new Date(compra.fechaCompromisoEntrega);
    this.fechaEntregaString = `${this.fechaEntrega.getFullYear()}-${ (this.fechaEntrega.getMonth()<10)?0:'' }${ this.fechaEntrega.getMonth() + 1 }-${(this.fechaEntrega.getDate()<10)?0:''}${ this.fechaEntrega.getDate() }`;
    this.comentario=compra.comentarioCompras;
    this.descripcionCompra = compra.descripcionCompra;
    this.tipoDeProveedor = compra.tipoDeProveedor;

  }

  actualizarCompra(){

    let compra={
      proveedor:this.proveedor._id,
      costoTotal:this.costo,
      fechaCompromisoEntrega:this.fechaEntrega,
      comentarioCompras:this.comentario,
      descripcionCompra: this.descripcionCompra,
      tipoDeProveedor: this.tipoDeProveedor,
      _id:this.compra._id
    };

    this._compraService.actualizarCompra(compra)
      .subscribe(
        (resp:any)=>{
          this.fechaEntrega = resp.compra.fechaCompromisoEntrega;
          
          resp.compra.requisiciones.forEach((requisicion)=>{
            this.actualizarRequisicion(requisicion._id,resp.compra._id);
          });
        
          this.refrescarTablas();
          swal(
            "Compra Actualizada",
            "La compra se ha actualizado exitosamente",
            "success"
          );
        },
        (error)=>{
          swal(
            "Error al crear Orden de Compra",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });
  }

  actualizarRequisicion(requisicionId, compraId){
    let requisicion = {
      compraCreada: true,
      estatus: 'Pedido',
      fechaCompromisoProveedor: this.fechaEntrega,
      compra: compraId,
      _id: requisicionId
    }

    this._requisicionService.actualizarRequisicion(requisicion).subscribe(
      (resp)=>{

    },
    (error)=>{
      swal(
        "Error al crear Orden de Compra",
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });
  }

  cambiarFecha(){
    this.fechaEntrega = new Date();

    let horas = this.fechaEntrega.getHours();
    let minutos = this.fechaEntrega.getMinutes();

    let fechaArray = this.fechaEntregaString.split('-');
    this.fechaEntrega = new Date(Number(fechaArray[0]), Number(fechaArray[1]) - 1, Number(fechaArray[2]), horas, minutos);
    
  }

  resetearModal(){
    this.proveedor=null;
    this.proveedorNombre=null;
    this.costo=0;
    this.fechaEntrega=null;
    this.fechaEntregaString=null; 
    this.comentario='';
    this.descripcionCompra='';
    this.tipoDeProveedor='';

    this.deseleccionarRequisicion.emit();
    this.compra=null;
    this.requisiciones=[];
  }

  eliminarCompra(compra){
    swal(
      "Confirmación de eliminación",
      "La compra y todos los pagos realizados serán eliminados, esta seguro que desea continuar?",
      "warning",
      {
        buttons: {
          continuar: {
            text: "Sí",
            value: true
          },
          cancelar: {
            text: "No",
            value: false
          }
        }
      }
    ).then(
      (continuar) => {
        if (continuar) {
          this._compraService.eliminarCompra(compra)
            .subscribe(
              (resp:any)=>{
                $('#modalOrdenDeCompra').modal('toggle');
                swal(
                  "Compra eliminada",
                  "La compra, los pagos y requisiciones asociados a ella se han eliminado exitosamente.",
                  "success"
                );
                this.refrescarTablas();
                this.resetearModal();
            },
            (error)=>{
              swal(
                "Error al eliminar Orden de Compra",
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            });
        } else {
          return;
        }
      }
    );
  }

  crearOrdenDeCompra(){

    // Validamos que el costo no sea negativo
    if(this.costo<0){
      swal(
        "Costo no válido",
        "No es posible registrar ventas con un costo negativo",
        "warning"
      );
      this.costo=0;
      return;
    }

    // Confirmamos si el usuario desea registrar una compra con valor cero
    if(this.costo==0){
      swal(
        "Confirmación de costo",
        "El costo ingresado es cero, esta seguro que desea continuar?",
        "warning",
        {
          buttons: {
            continuar: {
              text: "Sí",
              value: true
            },
            cancelar: {
              text: "No",
              value: false
            }
          }
        }
      ).then(
        (continuar)=>{
          if(continuar){
            this.registrarCompra();
          }else{
            return;
          }
        }
      );

    }else{
      this.registrarCompra();
    }

   
  }

  registrarCompra(){
    
    let compra = {
      requisiciones: this.requisiciones,
      fechaCompra: new Date(),
      fechaCompromisoEntrega: this.fechaEntrega,
      fechaReciboMercancia: null,
      proveedor: this.proveedor._id,
      costoTotal: this.costo,
      montoPagado: 0,
      saldoPendiente: this.costo,
      estatus: 'Saldo Pendiente',
      descripcionCompra: this.descripcionCompra,
      comentarioCompras: this.comentario,
      usuarioCreador: this._usuarioService.id,
      tipoDeProveedor: this.tipoDeProveedor
    };

    this._compraService.crearCompra(compra)
      .subscribe(
        (resp: any) => {
          
          this.marcarRequisicionComoComprada(resp.compra._id);
          
          $('#modalOrdenDeCompra').modal('toggle');
          this.resetearModal();
          swal(
            "Orden de Compra Creada",
            "La orden de compra se ha creado exitosamente",
            "success"
          );
        },
        (error) => {
          swal(
            "Error al crear Orden de Compra",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });
  }

  marcarRequisicionComoComprada(compraId){

    this.requisiciones.forEach((req, index)=>{

      let requisicion = {
        compraCreada: true,
        estatus: 'Pedido',
        fechaCompromisoProveedor: this.fechaEntrega,
        compra: compraId,
        _id: req._id
      }

      this._requisicionService.actualizarRequisicion(requisicion)
        .subscribe(
          (resp: any) => {

            if(index>=(this.requisiciones.length-1)){
              this.refrescarTablas();
            }
          },
          (error) => {
            if (index >= (this.requisiciones.length-1)) {
              this.refrescarTablas();
            }
            swal(
              "Error al crear Orden de Compra",
              error.error.mensaje + " | " + error.error.errors.message,
              "error"
            );
          });
    })

    
  }

  refrescarTablas(){
    this.actualizarData.emit();
  }

  //Metodos para buscador de proveedores y modal registro de proveedores
  buscarProveedor(){
    let termino = this.proveedorNombre;

    if (termino.length === 0) {
      this.proveedores = [];
      return;
    }

    if (termino.length < 1) {
      return;
    }
    this._proveedorService.buscarProveedor(termino).subscribe(
      (resp: any) => {
        this.proveedores = resp.proveedor;
      },
      error => {

        swal(
          "Error al buscar Proveedor",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  abrirRegistroDeProveedor(event){
    event.preventDefault();
    event.stopPropagation();

    $("#modalOrdenDeCompra").modal("toggle");
    $("#modalOrdenDeCompra").on("hidden.bs.modal", function (event) {
      // Open your second one in here
      $("#modalNuevoProveedor").modal("toggle");
      $("#modalOrdenDeCompra").off("hidden.bs.modal");

      $("#modalNuevoProveedor").on('hidden.bs.modal', function (event){
        $("#modalOrdenDeCompra").modal("toggle");
        $("#modalNuevoProveedor").off("hidden.bs.modal");
      });


    });
  }

  seleccionarProveedor(proveedor){
    this.proveedor = proveedor;
    this.proveedorNombre = proveedor.nombre;
    this.proveedores = [];

  }
  //FIN de Metodos para buscador de proveedores y modal registro de proveedores

}
