import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: "app-nuevo-evento",
  templateUrl: "./nuevo-evento.component.html",
  styleUrls: ["./nuevo-evento.component.css"]
})
export class NuevoEventoComponent implements OnInit {
  @Output()
  nuevoEvento: EventEmitter<any> = new EventEmitter();

  nombreEvento: string = "";
  claseEvento: string = "primary";

  cliente:any={};
  proyecto:any={};

  constructor(
    private shared:SharedService
  ) {
    console.log(this.shared.clienteSeleccionado);
    console.log(this.shared.proyectoSeleccionado);
    
    this.cliente=this.shared.clienteSeleccionado;
    this.proyecto=this.shared.proyectoSeleccionado;
  }

  ngOnInit() {}

  guardarEvento(){

    if(this.nombreEvento!=''){
  
      this.nuevoEvento.emit({
        'nombreEvento':this.nombreEvento
      });

    }

    this.resetearModal();
    
  }

  resetearModal() {
    this.nombreEvento = '';
  }
}
