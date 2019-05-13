import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Component({
  selector: "app-modal-ajustes-nomina",
  templateUrl: "./modal-ajustes-nomina.component.html",
  styleUrls: ["./modal-ajustes-nomina.component.css"]
})
export class ModalAjustesNominaComponent implements OnInit {
  @Input()
  nominaEmpleado: any;

  @Output()
  actualizarNomina: EventEmitter<any> = new EventEmitter();

  //Variables de formulario
  motivo: string;
  monto: number;
  tipo: string;

  //Data
  tiposDeAjustes=[
    "Bono",
    "Deducción"
  ];

  constructor() {}

  ngOnInit() {}

  resetearModal() {
    this.motivo = null;
    this.monto = null;
    this.tipo = null;
  }

  agregarAjuste() {

    if( !this.motivo || !this.monto || !this.tipo ){
      return;
    }

    let motivo = this.motivo;
    let monto = this.monto;
    let tipo = this.tipo;

    if (tipo ==='Deducción'){
      monto = monto*-1;
    }

    let ajuste = { motivo, monto, tipo };

    this.nominaEmpleado.ajustes.push(ajuste);

    this.calcularTotalAjustesYActualizarSalarioFinal();

    this.motivo = null;
    this.monto = null;
    this.tipo = null;

  }

  calcularTotalAjustesYActualizarSalarioFinal(){
    let totalAjustes = 0;

    this.nominaEmpleado.ajustes.forEach(ajuste => {

        totalAjustes += ajuste.monto;

    });

    this.nominaEmpleado.totalAjustes = totalAjustes;

    this.nominaEmpleado.salarioFinal = this.nominaEmpleado.salarioBase + totalAjustes;
    
  }

  eliminarAjuste(i) {

    this.nominaEmpleado.ajustes.splice( i, 1 );
    this.calcularTotalAjustesYActualizarSalarioFinal();

  }

  guardarNominaEmpleado() {

    this.actualizarNomina.emit(this.nominaEmpleado);
    $('#modalAjusteNomina').modal('toggle');
  }
}
