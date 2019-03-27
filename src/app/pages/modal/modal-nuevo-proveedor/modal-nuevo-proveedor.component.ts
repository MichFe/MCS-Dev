import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
declare var $:any;

@Component({
  selector: 'app-modal-nuevo-proveedor',
  templateUrl: './modal-nuevo-proveedor.component.html',
  styleUrls: ['./modal-nuevo-proveedor.component.css']
})
export class ModalNuevoProveedorComponent implements OnInit {

  //Variables de formulario
  nombre:string;
  telefono:string;
  domicilio:string;
  email:string;

  constructor(
    private _proveedorService:ProveedorService
  ) { }

  ngOnInit() {
  }

  resetearModal(){

    this.nombre=null;
    this.telefono=null;
    this.domicilio=null;
    this.email=null;
    
  }

  registrarProveedor(forma){
    //Validamos que el formulario contenga nombre y telefono
    if(!forma.nombre || !forma.telefono ){
      return;
    }

    let proveedor = {
        nombre: forma.nombre,
        telefono: forma.telefono,
        direccion: forma.direccion,
        email: forma.email
    };

    this._proveedorService.crearProveedor(proveedor)
      .subscribe(
        (resp:any)=>{

          $('#modalNuevoProveedor').modal('toggle');
          this.resetearModal();

          swal(
            'Proveedor Creado',
            `El proveedor ${ resp.proveedor.nombre }, se registró correctamente`,
            'success'
          );
      },
      (error)=>{

        $('#modalNuevoProveedor').modal('toggle');
        this.resetearModal();

        swal(
          "Error al recargar venta",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

}
