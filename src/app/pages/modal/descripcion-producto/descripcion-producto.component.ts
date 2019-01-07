import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.css']
})
export class DescripcionProductoComponent implements OnInit {

  @Output()
  guardarDescripcion:EventEmitter<any> = new EventEmitter();

  @Input()
  descripcion:string="";

  constructor() { }

  ngOnInit() {
  }

  guardarCambios(){
    
    this.guardarDescripcion.emit(this.descripcion);
    this.resetearModal();
  }

  resetearModal(){
    this.descripcion="";
  }

}
