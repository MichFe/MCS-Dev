import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PagosService } from 'src/app/services/pagos/pagos.service';
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
    private _pagosService:PagosService
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
          this.actualizarData.emit();
          $('#modalPago').modal('toggle');
          swal(
            "Pago registrado exitosamente",
            "El pago se ha registrado exitosamente",
            "success"
          );
      },
      (error)=>{
        swal(
          "Error al registrat pago",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

}
