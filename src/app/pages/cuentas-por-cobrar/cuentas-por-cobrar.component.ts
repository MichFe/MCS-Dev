import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/services/ventas/ventas.service';
import { CobroService } from 'src/app/services/cobros/cobro.service';

declare var $:any;

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.css']
})
export class CuentasPorCobrarComponent implements OnInit {

  clienteActual:string;
  ventaSeleccionada:any;
  totalSaldoPendiente:number=0;
  totalMontoPagado:number=0;

  idClienteActual:string;
  indexClienteActual:number;

  //Variables de formulario
  clienteNombre:string;


  //Data
  clientesConSaldoPendiente: any[];
  ventasConSaldo:any[]=[];

  constructor(
    private _ventasService: VentasService,
    private _cobrosService: CobroService
  ) { }

  ngOnInit() {
   this.cargarClientesSaldoPendiente();
   this.obtenerTotalSaldoPendiente();
  }

  filtrarClientes(){

    let nombreCliente: string
    let termino: string;
    termino=this.clienteNombre.trim();
    termino=termino.toUpperCase();

    //Si el campo busqueda tiene 0 caracteres, volvemos a llamar a todos los cientes
    if(this.clienteNombre.length==0){
      this.cargarClientesSaldoPendiente();
      this.ventasConSaldo=[];
    }
    //Si el campo de busqueda tiene menos de 3 caracteres no se ejecuta la busqueda
    if(this.clienteNombre.length<3){
      this.ventasConSaldo = [];
      return;
    }
    let clientesFiltrados=[];
    this.clientesConSaldoPendiente.forEach((cliente,i)=>{
      nombreCliente=cliente.cliente.nombre;
      nombreCliente=nombreCliente.toUpperCase();
      nombreCliente=nombreCliente.trim();

      if(nombreCliente.includes(termino)){
        //Si el termino de busqueda no coincide con el nombre del cliente lo sacamos del array
        clientesFiltrados.push(cliente);
      }
    });

    this.clientesConSaldoPendiente=clientesFiltrados;



  }

  obtenerTotalSaldoPendiente(){
    this._ventasService.obtenerSaldoPendienteDeTodosLosTiempos()
      .subscribe(
        (resp:any)=>{
          this.totalMontoPagado = resp.totalMontoPagado;
          this.totalSaldoPendiente = resp.totalSaldoPendiente;
      },
        (error) => {
          swal(
            "Error al obtener total saldo pendiente y monto pagado",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });
  }

  obtenerCobros(ventaId,i){

    if(this.ventasConSaldo[i].cobros){
      this.ventasConSaldo[i].cobros=null;

      return;

    }

    this._cobrosService.obtenerCobro(ventaId)
      .subscribe(
        (resp:any)=>{

          this.ventasConSaldo[i].cobros=resp.pagos;
          
      });

  }

  actualizarData(){
    
    this.cargarClientesSaldoPendiente();
    this.cargarVentasConSaldoDelCliente(this.idClienteActual,this.indexClienteActual);
    this.obtenerTotalSaldoPendiente();
  }

  cargarClientesSaldoPendiente(){
    this._ventasService.obtenerListaDeClientesConSaldoPendiente().subscribe(
      (resp: any) => {
        this.clientesConSaldoPendiente = resp.clientes;
      },
    );
  }

  registrarPago(venta){
    this.ventaSeleccionada= venta;

    $('#modalRegistrarCobro').modal('toggle');

  }

  eliminarPago(pago){

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
                this.actualizarData();
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

  cargarVentasConSaldoDelCliente(id, index){
    this.idClienteActual=id;
    this.indexClienteActual=index;

    this._ventasService.obtenerVentasConSaldoPendienteDeUnCliente(id).subscribe(
      (resp:any)=>{
        this.ventasConSaldo = resp.ventasConSaldo;
        this.clienteActual = (resp.ventasConSaldo[0])?resp.ventasConSaldo[0].cliente.nombre:null;

        //Reseteamos la propiedad activo de todos los demas clientes
        this.clientesConSaldoPendiente.forEach(cliente=>{
          cliente.activo=false;
        });
        //Seteamos el cliente clickeado como cliente activo        
        (resp.ventasConSaldo[0])?this.clientesConSaldoPendiente[index].activo=true:null;
      }
    );
  }

}
