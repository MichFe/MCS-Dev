import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PagosService } from 'src/app/services/pagos/pagos.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';
declare var $:any;

@Component({
  selector: "app-modal-pago",
  templateUrl: "./modal-pago.component.html",
  styleUrls: ["./modal-pago.component.css"]
})
export class ModalPagoComponent implements OnInit {
  @Input()
  compra: any;

  @Output()
  actualizarData: EventEmitter<any> = new EventEmitter();

  //Variables
  fecha = new Date();

  //Variables de formulario
  monto: number;
  tipoDePago: string;
  fechaString: string;

  constructor(
    private _pagosService: PagosService,
    private _gastoService: GastoService
  ) {}

  ngOnInit() {
    this.fecha = new Date();
    this.cargarFechaString();
  }

  resetearModal() {
    this.monto = 0;
    this.tipoDePago = null;
  }

  registrarPagoAProveedor() {

    //Validamos que el monto pagado no sea mayor al saldo pendiente
    if(this.monto>this.compra.saldoPendiente){
      swal(
        "Monto mayor al saldo",
        "El monto ingresado es mayor al saldo pendiente, favor de ajustarlo",
        "warning"
      );

      return;
    }

    let pago = {
      compra: this.compra._id,
      proveedor:
        this.compra.proveedor && this.compra.proveedor._id
          ? this.compra.proveedor._id
          : this.compra.proveedor,
      monto: this.monto,
      tipoDePago: this.tipoDePago,
      fecha: this.fecha
    };

    this._pagosService.registraPago(pago).subscribe(
      (resp: any) => {
        let gasto = {
          fecha: resp.pago.fecha,
          monto: resp.pago.monto,
          descripcion: this.compra.descripcionCompra,
          categoria: this.compra.tipoDeProveedor,
          proveedor: resp.pago.proveedor,
          pagoCompra: resp.pago._id,
          gastoOperativo: true
        };

        if( this.compra.tipoDeProveedor)

        this._gastoService.crearGasto(gasto).subscribe(
          resp => {
            swal(
              "Pago registrado exitosamente",
              "El pago se ha registrado exitosamente",
              "success"
            );
          },
          error => {
            swal(
              "El pago fue registrado pero ocurrió un error al registrar el gasto",
              error.error.mensaje + " | " + error.error.errors.message,
              "error"
            );
          }
        );
        this.actualizarData.emit();
        this.resetearModal();
        $("#modalPago").modal("toggle");
      },
      error => {
        swal(
          "Error al registrar pago",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  cambiarFecha() {
    this.fecha = new Date();

    let horas = this.fecha.getHours();
    let minutos = this.fecha.getMinutes();

    let fechaArray = this.fechaString.split("-");
    this.fecha = new Date(
      Number(fechaArray[0]),
      Number(fechaArray[1]) - 1,
      Number(fechaArray[2]),
      horas,
      minutos
    );
  }

  cargarFechaString() {
    let year = this.fecha.getFullYear();
    let mes = this.fecha.getMonth();
    let dia = this.fecha.getDate();
    mes = mes + 1;
    let mesString: string;
    let diaString: string;

    if (mes < 10) {
      mesString = "0" + mes;
    } else {
      mesString = String(mes);
    }

    if (dia < 10) {
      diaString = "0" + dia;
    } else {
      diaString = String(dia);
    }

    this.fechaString = `${year}-${mesString}-${diaString}`;
  }
}
