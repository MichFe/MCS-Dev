import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../../services/subirArchivo/subir-archivo.service';
import { ImageUploadService } from './image-upload.service';

declare var $:any;

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.css"]
})
export class ImageUploadComponent implements OnInit {

  imagenSubir: File;
  hayImagen: boolean = false;
  imagenTemporal: string | ArrayBuffer;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _imageUploadService: ImageUploadService
  ) {}

  ngOnInit() {}

  subirImagen(){
    
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._imageUploadService.tipo, this._imageUploadService.id )
        .then( resp=>{

          this._imageUploadService.notificacion.emit( resp );
          this._imageUploadService.resetearModal();
          this.resetearModal();

          swal(
            "Carga de imagen exitosa",
            "La imagen se ha guardado de manera exitosa",
            "success"
          );


        })
        .catch( (error:any) =>{

          swal(
            "Error al guardar imagen",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
          
        });
        
        $('#cargarImagen').modal("toggle");
        $('#infoCliente').modal('toggle');
        
  }

  resetearModal(){
    this.imagenTemporal=null;
    this.imagenSubir=null;
    this.hayImagen=false;

    this._imageUploadService.resetearModal();
  }

  seleccionImagen(evento) {
    let file: File = evento.target.files[0];

    if (!file) {
      this.imagenSubir = null;
      this.hayImagen = false;
      this.imagenTemporal = null;
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
    this.hayImagen = true;

    let reader = new FileReader();
    let urlImagenTemporal = reader.readAsDataURL(file);

    reader.onloadend = () => this.imagenTemporal = reader.result;

  }

}
