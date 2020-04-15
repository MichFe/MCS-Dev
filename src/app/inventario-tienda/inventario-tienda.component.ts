import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/productos/producto.service';

@Component({
  selector: 'app-inventario-tienda',
  templateUrl: './inventario-tienda.component.html',
  styleUrls: ['./inventario-tienda.component.css']
})
export class InventarioTiendaComponent implements OnInit {

  familias:any = [];

  constructor(
    private _productoService:ProductoService
  ) { }

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos(){
    this._productoService.obtenerFamiliasYProductos().subscribe(
      (resp:any)=>{
        this.familias = resp.familias;
    },
    (error)=>{

    });
  }

  editarInventario(event, producto){

    let elemento:any = event.srcElement;
    
    let elementoEditable = elemento.cloneNode();
    let cantidad:number = 0;

    elementoEditable.contentEditable = true;
    elementoEditable.style.backgroundColor = "#caebf1";

    elemento.parentNode.replaceChild(elementoEditable, elemento);

    elementoEditable.addEventListener("keyup", (keyup) => {
      let inputNumber = Number(elementoEditable.innerText.trim());

      if (keyup.keyCode == 13) {

        if (!isNaN(inputNumber)) {
          cantidad = inputNumber;
        }
        elementoEditable.blur();
      }

    });

    elementoEditable.addEventListener('blur', () => {
      this.ajusteDeInventario(producto, cantidad);
      
      elementoEditable.parentNode.replaceChild(elemento, elementoEditable);
      elementoEditable.remove();
    });

    elementoEditable.focus();
    
  }

  ajusteDeInventario( producto, cantidad ){

    let productoObj = {
      _id: producto.productoId,
      cantidad: cantidad
    };

    this._productoService.actualizarProducto(productoObj).subscribe(
      (resp:any)=>{
        producto.cantidad= resp.producto.cantidad;
    },
    (error)=>{

    });
  }

}
