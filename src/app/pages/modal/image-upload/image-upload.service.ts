import { Injectable, EventEmitter } from '@angular/core';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  public id:string;
  public tipo:string;
  public indexProductoEnCotizacion:number=null;

  public notificacion = new EventEmitter<any>();

  constructor() { }

  inicializarModal( tipo:string, id:string ){
    this.id=id;
    this.tipo=tipo;
    $("#cargarImagen").modal('toggle');
  }

  resetearModal(){
    this.tipo=null;
    this.id=null;
    $("#cargarImagen").modal("toggle");
    this.indexProductoEnCotizacion=null;

  }




}
