import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { SubirArchivoService } from 'src/app/services/subirArchivo/subir-archivo.service';
declare var $:any;

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  imagenSubir: File;
  imagenTemporal: string | ArrayBuffer;

  codigo: string;
  nombre: string;
  familia: string;
  img: string = null;
  precio: number;
  usuarioCreador: string;
  usuarioUltimaModificacion: string;
  imageLoading: boolean = false;

  familias: string[] = [
    "Credenzas",
    "Mesas",
    "Cómodas",
    "Sillas",
    "Sillones",
    "Bancas",
    "Bancos",
    "Mesas",
    "Libreros",
    "Lámparas",
    "Ocasionales",
    "Salas",
    "Cabeceras",
    "Bases de Cama",
    "Libreros"
  ];

  formaValida: boolean = false;

  @Output()
  actualizarFamilia: EventEmitter<any> = new EventEmitter();

  @Input()
  producto: Producto;


  constructor(
    public _usuarioService: UsuarioService,
    public _productoService: ProductoService,
    public _subirArchivoService: SubirArchivoService
  ) { }

  ngOnInit() {
    this.usuarioCreador = this._usuarioService.id;
    this.usuarioUltimaModificacion = this._usuarioService.id;
  }

  ngOnChanges() {
    this.nombre = this.producto.nombre;
    this.codigo = this.producto.codigo;
    this.familia = this.producto.familia;
    this.precio = this.producto.precio;
  }

  resetearModal() {
    this.codigo = this.producto.codigo;
    this.nombre = this.producto.nombre;
    this.familia = this.producto.familia;
    this.img = this.producto.img;
    this.precio = this.producto.precio;

    this.imagenSubir = null;
    this.imagenTemporal = null;
    this.imageLoading = false;
  }

  agregarImagen() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onclick = () => {
      this.imageLoading = true;
    };


    input.onchange = () => {

      let file: File = input.files[0];

      if (!file) {
        this.imagenSubir = null;
        this.imagenTemporal = null;

        return;
      }

      if (file.type.indexOf("image") < 0) {
        swal("Típo de archivo inválido", "Seleccione una imágen", "error");

        this.imagenSubir = null;
        return;
      }

      this.imagenSubir = file;
      let reader = new FileReader();
      let urlImagenTemporal = reader.readAsDataURL(file);

      reader.onloadend = () => {
        this.imagenTemporal = reader.result;
        this.imageLoading = false;
      };
    };

    input.click();
  }

  validarFormulario() { }

  actualizarProducto(forma) {
    //Leemos los valores a actualizar de la forma
    let producto = {
      nombre: this.nombre,
      codigo: this.codigo,
      precio: this.precio,
      familia: this.familia,
      _id: this.producto._id
    };
      
    //Ejecutamos la petición html para actualizar el producto
      this._productoService.actualizarProducto( producto )
        .subscribe( 
          (resp:any)=>{
            if(!this.imagenSubir){
              //Refrescamos familia
              this.actualizarFamilia.emit(producto.familia);

              swal(
              "Producto actualizado exitosamente",
              "El producto: " +
              producto.nombre +
              " se actualizó exitosamente",
              "success"
            );

              $("#editarProducto").modal("toggle");
              this.resetearModal();
            }else{
              //Hacemos la carga de la imagen con el id que se genero al crear el producto
              let producto = resp.producto;

              this._subirArchivoService
                .subirArchivo(this.imagenSubir, "producto", producto._id)
                .then(resp => {
                  swal(
                    "Producto actualizado exitosamente",
                    "El producto: " + producto.nombre + " se actualizó exitosamente",
                    "success"
                  );

                  //Refrescamos familia
                  this.actualizarFamilia.emit(producto.familia);

                  $("#editarProducto").modal("toggle");
                  this.resetearModal();
                })
                .catch(error => {
                  console.log(error);

                  swal(
                    "La información del producto se actualizó, pero ocurrió un error al subir la imagen",
                    error.error.mensaje + " | " + error.error.errors.message,
                    "warning"
                  );

                  $("#editarProducto").modal("toggle");
                  this.resetearModal();
                  return;
                });
            }
            
          },
          (error)=>{
            swal(
              "Error al actualizar el producto",
              error.error.mensaje + " | " + error.error.errors.message,
              "error"
            );
          }
         );

  }


}


