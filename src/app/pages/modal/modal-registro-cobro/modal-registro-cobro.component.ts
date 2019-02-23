import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CobroService } from 'src/app/services/cobros/cobro.service';

declare var $:any;

@Component({
  selector: 'app-modal-registro-cobro',
  templateUrl: './modal-registro-cobro.component.html',
  styleUrls: ['./modal-registro-cobro.component.css']
})
export class ModalRegistroCobroComponent implements OnInit {

  @Input()
  venta:any;

  @Output() actualizarVentasDelCliente: EventEmitter<any> = new EventEmitter();

  //Variables de formulario
  tipoPago: string;
  monto: number;
  fechaString: string;

  //Variables
  fecha = new Date();

  constructor(
    private _cobroService:CobroService
  ) { }

  ngOnInit() {
    this.fecha = new Date();
    this.cargarFechaString();
  }

  cargarFechaString() {
    let year = this.fecha.getFullYear();
    let mes = this.fecha.getMonth();
    let dia = this.fecha.getDate();
    mes = mes + 1;
    let mesString: string;
    let diaString: string;

    if (mes < 10) {
      mesString = '0' + mes;
    } else {
      mesString = String(mes);
    }

    if (dia < 10) {
      diaString = '0' + dia;
    } else {
      diaString = String(dia);
    }

    this.fechaString = `${year}-${mesString}-${diaString}`;

  }

  cambiarFecha() {
    this.fecha = new Date();

    let horas = this.fecha.getHours();
    let minutos = this.fecha.getMinutes();

    let fechaArray = this.fechaString.split('-');
    this.fecha = new Date(Number(fechaArray[0]), Number(fechaArray[1]) - 1, Number(fechaArray[2]), horas, minutos);

  }

  registrarCobro(){
    
    let cobro = {
      venta: this.venta._id,
      cliente: this.venta.cliente._id,
      monto: this.monto,
      tipoDePago: this.tipoPago,
      fecha: this.fecha
    };

    this._cobroService.registrarCobro(cobro)
      .subscribe(
        (resp)=>{

          this.actualizarVentasDelCliente.emit();

          $('#modalRegistrarCobro').modal('toggle');
          this.monto=null;
          this.tipoPago=null;

          swal(
            'Registro exitoso',
            'El pago fue registrado de manera exitosa',
            'success'
          );
      },
      (error)=>{
        swal(
          "Error al registrar pago",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
    
  }

  resetearModal(){

  }

}
