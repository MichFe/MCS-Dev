import { Injectable, EventEmitter } from '@angular/core';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  public id:string;
  public tipo:string;

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
  }




}
