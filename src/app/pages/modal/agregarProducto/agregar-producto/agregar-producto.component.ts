import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Producto } from '../../../../models/producto.model';
import { UsuarioService } from '../../../../services/usuarios/usuario.service';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { SubirArchivoService } from 'src/app/services/subirArchivo/subir-archivo.service';
declare var $:any;

@Component({
  selector: "app-agregar-producto",
  templateUrl: "./agregar-producto.component.html",
  styleUrls: ["./agregar-producto.component.css"]
})
export class AgregarProductoComponent implements OnInit {
  imagenSubir: File;
  imagenTemporal: string | ArrayBuffer;
  producto: Producto;

  codigo: string;
  nombre: string;
  familia: string;
  img: string = null;
  precio: number;
  usuarioCreador: string;
  usuarioUltimaModificacion: string;
  imageLoading:boolean = false;

  @Output()
  actualizarFamilia: EventEmitter<any> = new EventEmitter();

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
    "Libreros",
    "Cuadros",
    "Tapetes",
    "Accesorios"
  ];

  formaValida: boolean = false;

  constructor(
    public _usuarioService: UsuarioService,
    public _productoService: ProductoService,
    private _subirArchivoService: SubirArchivoService
  ) {}

  ngOnInit() {
    this.usuarioCreador = this._usuarioService.id;
    this.usuarioUltimaModificacion = this._usuarioService.id;
  }

  resetearModal() {
    this.codigo = null;
    this.nombre = null;
    this.familia = null;
    this.img = null;
    this.precio = null;

    this.imagenSubir = null;
    this.imagenTemporal = null;
    this.producto = null;
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

  validarFormulario() {}

  registrarProducto(forma) {
    //Creamos el objeto producto con la información de la forma
    let producto = new Producto(
      forma.codigo,
      forma.nombre,
      forma.familia,
      forma.precio,
      this.usuarioCreador,
      this.usuarioUltimaModificacion,
      null
    );

    //Ejecutamos la petición html para crear el producto
    this._productoService.registrarProducto(producto).subscribe(
      (resp: any) => {
        //Validamos existencia de imagen
        if (!this.imagenSubir) {
          //Refrescamos familia
          
          this.actualizarFamilia.emit(producto.familia);

          swal(
            "Producto registrado exitosamente",
            "El producto: " +
              producto.nombre +
              " se registró exitosamente, aunque no se selecciono una imagen para el mismo",
            "warning"
          );

          $("#nuevoProducto").modal("toggle");
          this.resetearModal();
        } else {
          //Hacemos la carga de la imagen con el id que se genero al crear el producto
          let producto = resp.producto;

          this._subirArchivoService
            .subirArchivo(this.imagenSubir, "producto", producto._id)
            .then(resp => {
              swal(
                "Producto registrado exitosamente",
                "El producto: " + producto.nombre + " se registró exitosamente",
                "success"
              );

              //Refrescamos familia
              this.actualizarFamilia.emit(producto.familia);

              $("#nuevoProducto").modal("toggle");
              this.resetearModal();
            })
            .catch(error => {
              console.log(error);

              swal(
                "La información del producto se registró, pero ocurrió un error al subir la imagen",
                error.error.mensaje + " | " + error.error.errors.message,
                "warning"
              );

              $("#nuevoProducto").modal("toggle");
              this.resetearModal();
              return;
            });
        }
      },
      error => {
        swal(
          "Error al registrar producto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }
}
