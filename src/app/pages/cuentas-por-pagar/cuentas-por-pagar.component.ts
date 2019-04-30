import { Component, OnInit } from '@angular/core';
import { OrdenCompraService } from 'src/app/services/ordenCompra/orden-compra.service';
import { PagosService } from 'src/app/services/pagos/pagos.service';
declare var $:any;

@Component({
  selector: 'app-cuentas-por-pagar',
  templateUrl: './cuentas-por-pagar.component.html',
  styleUrls: ['./cuentas-por-pagar.component.css']
})

export class CuentasPorPagarComponent implements OnInit {

  //Variables
  proveedorNombre:string;
  proveedoresConSaldoPendiente:any[];
  proveedorActual:string;
  comprasConSaldo:any[];
  compraSeleccionada:any;
  idProveedorActual:any;
  indexProveedorActual:number;
  totalSaldoPendiente: number = 0;
  totalMontoPagado: number = 0;

  //Variables de paginado
  conteoPagos: number = 0;
  paginaActual: number = 1;
  totalDePaginas: number;
  
  //Data
  pagos: any[] = [];

  constructor(
    private _comprasService:OrdenCompraService,
    private _pagosService:PagosService
  ) { }

  ngOnInit() {
    this.cargarProveedoresConSaldoPendiente();
    this.obtenerTotalSaldoPendiente();
    this.obtenerPagosPaginados(1);
  }

  obtenerPagosPaginados(pagina=1){
    let desde = (pagina-1)*10;
    this._pagosService.obtenerPagosPaginados(desde).subscribe(
      (resp:any)=>{
        this.pagos=resp.pagos;
        this.conteoPagos = resp.conteo;
        this.totalDePaginas = Math.ceil(this.conteoPagos / 10);
      });
  }

  actualizarData() {    
    this.cargarProveedoresConSaldoPendiente();
    this.cargarComprasConSaldoDelProveedor(this.idProveedorActual, this.indexProveedorActual);
  }

  filtrarProveedores(){

    let nombreProveedor: string;
    let termino: string;
    termino = this.proveedorNombre.trim();
    termino = termino.toUpperCase();

    //Si el campo busqueda tiene 0 caracteres, volvemos a llamar a todos los cientes
    if (this.proveedorNombre.length == 0) {
      this.cargarProveedoresConSaldoPendiente();
      this.comprasConSaldo = [];
    }

    //Si el campo de busqueda tiene menos de 3 caracteres no se ejecuta la busqueda
    if (this.proveedorNombre.length < 3) {
      this.comprasConSaldo = [];
      return;
    }    

    let proveedoresFiltrados=[];

    this.proveedoresConSaldoPendiente.forEach((proveedor, i) => {
      
      nombreProveedor = proveedor.proveedor.nombre;
      nombreProveedor = nombreProveedor.trim();
      nombreProveedor = nombreProveedor.toUpperCase();
      
      if (nombreProveedor.includes(termino)) {
        
        proveedoresFiltrados.push(proveedor);
      }
    });
    this.proveedoresConSaldoPendiente=proveedoresFiltrados;
  }

  cargarComprasConSaldoDelProveedor(id, index){

    this.idProveedorActual = id;
    this.indexProveedorActual = index;

    this._comprasService.obtenerComprasConSaldoPendienteDeUnProveedor(id)
      .subscribe(
        (resp: any) => {
          this.comprasConSaldo = resp.comprasConSaldo;
          this.proveedorActual = (resp.comprasConSaldo[0]) ? resp.comprasConSaldo[0].proveedor.nombre : null;

          //Reseteamos la propiedad activo de todos los demas proveedores
          this.proveedoresConSaldoPendiente.forEach( proveedor => {
            proveedor.activo = false;
          });
          //Seteamos el proveedor clickeado como proveedor activo        
          (resp.comprasConSaldo[0]) ? this.proveedoresConSaldoPendiente[index].activo = true : null;
        }
      );
  }

  registrarPago(compra:any){
    this.compraSeleccionada = compra;

    $('#modalPago').modal('toggle');
  }

  obtenerPagos(idCompra:any,i:number){
    if (this.comprasConSaldo[i].pagos) {
      this.comprasConSaldo[i].pagos = null;

      return;
    }

    this._pagosService.obtenerPago(idCompra)
      .subscribe(
        (resp: any) => {
          
          this.comprasConSaldo[i].pagos = resp.pagos;

        });
  }

  eliminarPago(pago:any){
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

          this._pagosService.eliminarPago(pago._id)
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

  cargarProveedoresConSaldoPendiente(){
    this._comprasService.obtenerListaDeProveedoresConSaldoPendiente()
      .subscribe(
        (resp:any)=>{
          this.proveedoresConSaldoPendiente=resp.proveedores;
      },
      (error)=>{
        swal(
          'Error al consultar proveedores con saldo pendiente',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      });
  }

  obtenerTotalSaldoPendiente() {
    this._comprasService.obtenerSaldoPendienteDeTodosLosTiempos()
      .subscribe(
        (resp: any) => {
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

  // Funciones de paginado
  paginaSiguiente() {
    if (this.paginaActual * 10 >= this.conteoPagos) {
      return;
    }
    this.paginaActual += 1;
    this.obtenerPagosPaginados(this.paginaActual);
  }

  paginaAnterior() {
    if (this.paginaActual === 1) {
      return;
    }
    this.paginaActual -= 1;
    this.obtenerPagosPaginados(this.paginaActual);
  }

}