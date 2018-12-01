import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { ImageUploadService } from '../image-upload/image-upload.service';

declare var $: any;

@Component({
  selector: "app-nuevo-cliente",
  templateUrl: "./nuevo-cliente.component.html",
  styleUrls: ["./nuevo-cliente.component.css"]
})
export class NuevoClienteComponent implements OnInit {

  @Input()
  toggleTicketModal:boolean=false;

  @Output()
  clienteNuevo: EventEmitter<any> = new EventEmitter();

  @Output()
  imagenCliente: EventEmitter<any> = new EventEmitter();

  mensajeRequeridos="Favor de completar el formulario";
  completo:boolean=false;

  nombre: string='';
  telefono: string='';
  direccion: string='';
  correo: string='';

  imagenSubir:File;
  imagenTemporal:string | ArrayBuffer;

  constructor(
    public _usuarioService:UsuarioService,
    public _imageUploadService:ImageUploadService
  ) {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

  ngOnInit() {}

  agregarImagen() {

    let input = document.createElement('input');
    input.type = 'file';
    input.accept='image/*';

    let promesa = new Promise( (resolve, reject)=>{

      input.onchange = () =>{

        let file:File=input.files[0];

        if(!file){
          this.imagenSubir=null;
          this.imagenTemporal=null;
          return;
        }

        if (file.type.indexOf('image') < 0) {
          swal(
            'Típo de archivo inválido',
            'Seleccione una imágen',
            'error'
          );

          this.imagenSubir = null;
          return;
        }

        this.imagenSubir = file;
        let reader = new FileReader();
        let urlImagenTemporal = reader.readAsDataURL(file);

        reader.onloadend = () => this.imagenTemporal = reader.result;

        
      };

      input.click();
    });

    promesa.then();



  }

  resetearModal(){
    this.nombre="";
    this.telefono="";
    this.direccion="";
    this.correo="";
    this.imagenTemporal=null;
    this.imagenSubir=null;
    
    if(this.toggleTicketModal){
      $("#nuevoCliente").on("hidden.bs.modal", function(event) {
        // Open your second one in here
        $("#ticketVenta").modal('toggle');

        $("#nuevoCliente").off("hidden.bs.modal");
      });

    }
  }

  validarFormulario(){
    if (this.nombre == '' || this.telefono == '' || this.direccion == ''){

      this.completo=false;

    }else{

      this.completo=true;

    }


  }

  registrarCliente() {

    if( this.nombre=='' || this.telefono=='' || this.direccion==''){
      return;
    }

    let nuevoCliente = new Cliente(
      this.nombre,
      this.telefono,
      this.direccion,
      this.correo,
      'Activo',
      null,
      null,
      this._usuarioService.id,
      this._usuarioService.id
    );


    this.clienteNuevo.emit(nuevoCliente);

    if(this.imagenSubir){

      this.imagenCliente.emit(this.imagenSubir);
    }

    $("#nuevoCliente").modal("toggle");

    this.resetearModal();
    this.validarFormulario();

  }

}
