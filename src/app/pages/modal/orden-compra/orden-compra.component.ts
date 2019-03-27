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
  proveedorNombre:string='';
  costo:number=0;
  fechaEntregaString:string;
  comentario:string='';

  //Requisicion
  @Input()
  requisicion:any;

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

  confirmarRecepcionDeProducto(){
    let compra={
      _id: this.compra._id,
      estatusPedido: 'Recibido'
    };

    this._compraService.actualizarCompra(compra)
      .subscribe((resp:any)=>{
        let fecha=new Date();
        let requisicion={
          _id: this.compra.requisicion._id,
          estatus: 'Recibido',
          fechaReciboMercancia: fecha,
          productoRecibido: true
        };

      this._requisicionService.actualizarRequisicion(requisicion)
        .subscribe((resp:any)=>{
          this.refrescarTablas();
          $('#modalOrdenDeCompra').modal('toggle');
          swal(
            "Actualización Exitosa",
            "El estatus de la Compra y la Requisición se han actualizado",
            "success"
          );
          this.resetearModal();
        },
        (error)=>{
          swal(
            "Error al actualizar Requisición",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
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

  }

  actualizarCompra(){

    let compra={
      proveedor:this.proveedor._id,
      costoTotal:this.costo,
      fechaCompromisoEntrega:this.fechaEntrega,
      comentarioCompras:this.comentario,
      _id:this.compra._id
    };

    this._compraService.actualizarCompra(compra)
      .subscribe(
        (resp:any)=>{
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

    this.deseleccionarRequisicion.emit();
    this.compra=null;
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
      requisicion: this.requisicion._id,
      fechaCompra: Date.now(),
      fechaCompromisoEntrega: this.fechaEntrega,
      fechaReciboMercancia: null,
      proveedor: this.proveedor._id,
      costoTotal: this.costo,
      montoPagado: 0,
      saldoPendiente: this.costo,
      estatus: 'Saldo Pendiente',
      comentarioCompras: this.comentario,
      usuarioCreador: this._usuarioService.id
    };

    this._compraService.crearCompra(compra)
      .subscribe(
        (resp: any) => {
          this.marcarRequisicionComoComprada();
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

  marcarRequisicionComoComprada(){

    let requisicion= {
      compraCreada: true,
      estatus:'Pedido',
      _id: this.requisicion._id
    }

    this._requisicionService.actualizarRequisicion(requisicion)
      .subscribe(
        (resp:any)=>{
          this.refrescarTablas();
        },
        (error)=>{
          swal(
            "Error al crear Orden de Compra",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });
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

    if (termino.length < 3) {
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
