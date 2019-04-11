import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PagosService } from 'src/app/services/pagos/pagos.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';
declare var $:any;

@Component({
  selector: 'app-modal-pago',
  templateUrl: './modal-pago.component.html',
  styleUrls: ['./modal-pago.component.css']
})
export class ModalPagoComponent implements OnInit {

  @Input()
  compra:any;

  @Output()
  actualizarData:EventEmitter<any>=new EventEmitter;

  //Variables de formulario
  monto:number;
  tipoDePago:string;

  constructor(
    private _pagosService:PagosService,
    private _gastoService:GastoService
  ) { }

  ngOnInit() {
    
  }

  resetearModal(){
    this.monto=0;
    this.tipoDePago=null;
  }

  registrarPagoAProveedor(){

    let pago = {
      compra: this.compra._id,
      proveedor: (this.compra.proveedor && this.compra.proveedor._id)?this.compra.proveedor._id:this.compra.proveedor,
      monto: this.monto,
      tipoDePago: this.tipoDePago,
      fecha: new Date()
    };

    this._pagosService.registraPago(pago)
      .subscribe(
        (resp:any)=>{

          let gasto={
            fecha: resp.pago.fecha,
            monto: resp.pago.monto,
            descripcion: `Pago a ${ this.compra.proveedor.nombre }`,
            categoria: 'Pago a proveedores',
            proveedor: resp.pago.proveedor,
            pagoCompra: resp.pago._id,
          }

          this._gastoService.crearGasto(gasto)
            .subscribe(
              (resp)=>{
                swal(
                  "Pago registrado exitosamente",
                  "El pago se ha registrado exitosamente",
                  "success"
                );
            },
            (error)=>{
              swal(
                "El pago fue registrado pero ocurrió un error al registrar el gasto",
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            });
          this.actualizarData.emit();
          this.resetearModal();
          $('#modalPago').modal('toggle');
      },
      (error)=>{
        swal(
          "Error al registrar pago",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

}
