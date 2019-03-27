import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';
import { Subscription } from 'rxjs';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { DeleteImageService } from 'src/app/services/deleteImage/delete-image.service';
declare var $:any;

@Component({
  selector: "app-cotizacion",
  templateUrl: "./cotizacion.component.html",
  styleUrls: ["./cotizacion.component.css"]
})
export class CotizacionComponent implements OnInit, OnChanges, OnDestroy {
  //Inputs
  @Input()
  proyecto: any = {};

  @Input()
  cliente: any = {};

  @Input()
  indexCotizacion:number=0;

  //Suscripciones
  cambiosCarrito:Subscription;

  //Variables
  fecha: number = Date.now();
  notaValida: boolean = true;
  totalImporte: number = 0;
  totalDescuento: number = 0;

  //Productos de la nota
  productos: any[];
  cotizaciones: any[]=[];
  cotizacion:any;



  politicas: any[] = [
    "Cotización en moneda nacional.",
    "Vigencia de cotización: 15 días.",
    "Los precios incluyen flete siempre y cuando sea dentro del área metropolitana de León Gto.",
    "Los precios están sujetos a cambio sin previo aviso, excepto con anticipo recibido.",
    "Tiempo de entrega según previo acuerdo. (Siempre y cuando se dé cumplimiento a los pagos correspondientes).",
    "Ningún trabajo incluye trabajos de albañilería, electricidad, fontanería y pintura.",
    "No se aceptan cambios ni modificaciones al proyecto una vez autorizado por el cliente y pagado el anticipo.",
    "En caso de cancelación no se regresa el anticipo. ",
    "Nuestros productos están garantizados contra cualquier defecto de fabricación siempre y cuando se usen en forma adecuada y para lo que fueron diseñados. (El tiempo de garantía varía según producto).	",
    "En proyectos bajo diseño es necesario contar con una o varias imágenes claras de lo que se busca producir",
    "En proyectos bajo diseño pueden existir algunas variaciones, el cliente al aceptar el proyecto declara que es consiente del riesgo. ",
    "No nos hacemos responsables por los diferentes tonos que tome la madera ya que varía según: Humedad, origen y varios factores externos a nuestras 	posibilidades."
  ];

  constructor(
    private _cotizacionService: CotizacionService,
    private _imageUploadService: ImageUploadService,
    private _deleteImageService:DeleteImageService
    ) {
      // this.productos = this._cotizacionService.productos;

      this.cambiosCarrito = this._cotizacionService.calcularTotalCotizacion.subscribe(
        ()=>{
          this.calcularTotal();
        }
      );

      this._imageUploadService.notificacion.subscribe((resp)=>{
        
        let cotizacionActualizada=resp.cotizacion;
        
        if ('cotizacion' in resp){
          
          this._cotizacionService.vaciarProductosDeCotizacion();
          this._cotizacionService.agregarProductosACotizacion(cotizacionActualizada.productos);
          
        }else{
          return;
        }
      })
    }

  ngOnInit() {
    this.obtenerCotizaciones(this.indexCotizacion);
  }

  ngOnDestroy(){
    this.cambiosCarrito.unsubscribe();
  }

  ngOnChanges(changes) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    this._cotizacionService.obtenerCotizacion(this.proyecto._id).subscribe(
      (resp:any)=>{
        let index=0;
        if(resp.cotizacion[this.indexCotizacion]){
          index=this.indexCotizacion;
        }

        if(resp.cotizacion[index]){
      
          this.cotizacion=resp.cotizacion[index];
          this._cotizacionService.productos = resp.cotizacion[index].productos;
          this.totalDescuento = resp.cotizacion[index].descuento;
          this.totalImporte = resp.cotizacion[index].subtotal;
          this.fecha = resp.cotizacion[index].fecha;

          this.productos=this._cotizacionService.productos;          

          this._cotizacionService.actualizarCotizaciones(resp.cotizacion);
          this.cotizaciones=this._cotizacionService.cotizaciones;
          
        }else{
          this.cotizacion=null;
          this._cotizacionService.productos = [];
          this.fecha = Date.now();
          this.totalDescuento = 0;
          this.totalImporte = 0;

          this.productos = this._cotizacionService.productos;
          this._cotizacionService.actualizarCotizaciones([]);
          this.cotizaciones = this._cotizacionService.cotizaciones;

        }


      },
      (err)=>{
        this.cotizacion = null;
        this._cotizacionService.productos=[];
        this.fecha = Date.now();
        this.totalDescuento = 0;
        this.totalImporte = 0;

        this._cotizacionService.actualizarCotizaciones([]);
        this.cotizaciones = this._cotizacionService.cotizaciones;
      }
    );

  }

  obtenerCotizaciones(indiceCotizacion=0){
    this._cotizacionService.obtenerCotizacion(this.proyecto._id).subscribe(
      (resp: any) => {                
        
        if (resp.cotizacion[indiceCotizacion]) {

          this.cotizacion = resp.cotizacion[indiceCotizacion];
          this._cotizacionService.productos = resp.cotizacion[indiceCotizacion].productos;
          this.totalDescuento = resp.cotizacion[indiceCotizacion].descuento;
          this.totalImporte = resp.cotizacion[indiceCotizacion].subtotal;
          this.fecha = resp.cotizacion[indiceCotizacion].fecha;

          this.productos = this._cotizacionService.productos;
          // this.cotizaciones=resp.cotizacion;

          //Centralizando manejo de cotizaciones (Array) a través de servicio
          this._cotizacionService.actualizarCotizaciones(resp.cotizacion);
          this.cotizaciones = this._cotizacionService.cotizaciones;


        } else {
          this.cotizacion = null;
          this._cotizacionService.productos = [];
          this.fecha = Date.now();
          this.totalDescuento = 0;
          this.totalImporte = 0;

          this.productos = this._cotizacionService.productos;
        }

        if(resp.cotizacion.length==0){

          // this.cotizaciones=[];
          this._cotizacionService.actualizarCotizaciones([]);
          this.cotizaciones = this._cotizacionService.cotizaciones;
        }


      },
      (err) => {
        this.cotizacion = null;
        this._cotizacionService.productos = [];
        this.fecha = Date.now();
        this.totalDescuento = 0;
        this.totalImporte = 0;

        // this.cotizaciones=[];
        this._cotizacionService.actualizarCotizaciones([]);
        this.cotizaciones = this._cotizacionService.cotizaciones;
      }
    );
  }

  crearNuevaCotizacion(){
    this.cotizacion = null;
    this._cotizacionService.productos = [];
    this.productos=this._cotizacionService.productos;
    this.fecha = Date.now();
    this.totalDescuento = 0;
    this.totalImporte = 0;

    this.scrollTop();
  }

  resetearModal() {}

  actualizarCotizacion(){

    //Si no hay una cotización en el componente retornamos
    if(!this.cotizacion){
      return;
    }

    this.cotizacion.productos = this._cotizacionService.productos;
    this.cotizacion.subtotal=this.totalImporte;
    this.cotizacion.descuento=this.totalDescuento;
    this.cotizacion.total=this.totalImporte - this.totalDescuento;
    

    this._cotizacionService.actualizarCotizacion(this.cotizacion).subscribe(
      (resp)=>{
        
        let indiceActualCotizacion = 0;
        this.cotizaciones.forEach((cotizacion,index)=>{
          if(cotizacion._id==this.cotizacion._id){
            indiceActualCotizacion=index;
          }
        });
        this.obtenerCotizaciones(indiceActualCotizacion);
        
        swal(
          "Cotización actualizada",
          "Cotización actualizada exitosamente",
          "success"
          );
      }
    );
  }

  mostrarDetalleCotizacion(indice){
    this.cotizacion = this.cotizaciones[indice];
    this._cotizacionService.productos = this.cotizaciones[indice].productos;
    this.totalDescuento = this.cotizaciones[indice].descuento;
    this.totalImporte = this.cotizaciones[indice].subtotal;
    this.fecha = this.cotizaciones[indice].fecha;

    this.productos = this._cotizacionService.productos;

    setTimeout(() => {
      this.scrollTop();
    });
  }

  abrirCatalogoDeProductos(){


    $("#cotizacion").modal("toggle");
    $("#cotizacion").on("hidden.bs.modal", function(event) {
      // Open your second one in here
      $("#catalogoModal").modal("toggle");
      $("#cotizacion").off("hidden.bs.modal");
    });
    
  }

  cambiarImagen(i){

    if( !this.cotizacion){

      let cotizacion = {
        proyecto: this.proyecto._id,
        cliente: this.cliente._id,
        fecha: new Date(),
        productos: this._cotizacionService.productos,
        subtotal: this.totalImporte,
        descuento: this.totalDescuento,
        total: this.totalImporte - this.totalDescuento
      };

      this._cotizacionService.guardarCotizacion(cotizacion).subscribe(
        (resp: any) => {

          this.cotizacion = resp.cotizacion;

          this.obtenerCotizaciones(this.cotizaciones.length);

          //Continuamos con la carga de la imagen
          $("#cotizacion").on("hidden.bs.modal", function (event) {
            $("#cotizacion").off("hidden.bs.modal");

            this._imageUploadService.indexProductoEnCotizacion = i;

            //Seteamos el modal de carga de imagen con el id de nuestra cotizacion y el tipo cotizacion
            this._imageUploadService.inicializarModal('cotizacion', this.cotizacion._id);

          }.bind(this));

          $("#cotizacion").modal("toggle");
          

        },
        (err) => {
          return;
        }
      );
    }else{

      // Actulizamos la cotizacion, para guardar los productos agregados del carito
      // en la base de datos
      // Necesitamos asegurarnos de esto porque si intentamos subir una imagen de un producto
      // que no ha sido guardado, nos dara un error en el backend ya q valida la imagen anterior
      // para eliminarla y sustituirla por la imagen nueva
      this.cotizacion.productos = this._cotizacionService.productos;

      this.cotizacion.subtotal = this.totalImporte;
      this.cotizacion.descuento = this.totalDescuento;
      this.cotizacion.total = this.totalImporte - this.totalDescuento;


      this._cotizacionService.actualizarCotizacion(this.cotizacion).subscribe(
        (resp) => {

          let indiceActualCotizacion = 0;
          this.cotizaciones.forEach((cotizacion, index) => {
            if (cotizacion._id == this.cotizacion._id) {
              indiceActualCotizacion = index;
            }
          });
          this.obtenerCotizaciones(indiceActualCotizacion);

          //Continuamos con la carga de la imagen
          $("#cotizacion").on("hidden.bs.modal", function (event) {
            $("#cotizacion").off("hidden.bs.modal");

            this._imageUploadService.indexProductoEnCotizacion = i;

            //Seteamos el modal de carga de imagen con el id de nuestra cotizacion y el tipo cotizacion
            this._imageUploadService.inicializarModal('cotizacion', this.cotizacion._id);

          }.bind(this));

          $("#cotizacion").modal("toggle");

        },
        (err) => {
          return;
        }
      );

    }

    

   
  }

  cambiarNombre(i){
    $("#cotizacion").modal("toggle");
    $("#cotizacion").on("hidden.bs.modal", function (event) {
      $("#cotizacion").off("hidden.bs.modal");
      // Open your second one in here

      swal({
        content: {
          element: "input"
        },
        text: "Cambiar descripcion",
        buttons: [true, "Aceptar"]
      })
        .then(nombre => {
          if (!nombre) {
            $("#cotizacion").modal("toggle");
            return;
          }
          this._cotizacionService.productos[i].nombre = nombre;
          this.calcularTotal();
          $("#cotizacion").modal("toggle");
        })
        .catch();
    }.bind(this));
  }

  cambiarPrecio(i){

    $("#cotizacion").modal("toggle");
    $("#cotizacion").on("hidden.bs.modal", function (event) {
      $("#cotizacion").off("hidden.bs.modal");
      // Open your second one in here

      swal({
        content: {
          element: "input"
        },
        text: "Asigna un nuevo precio",
        buttons: [true, "Aceptar"]
      })
        .then(precio => {
          if (!precio) {
            $("#cotizacion").modal("toggle");
            return;
          }
          this._cotizacionService.productos[i].precio = precio;
          this.calcularTotal();
          $("#cotizacion").modal("toggle");
        })
        .catch();
    }.bind(this));
  }

  cambiarCantidad(i){
    $("#cotizacion").modal("toggle");
    $("#cotizacion").on("hidden.bs.modal", function (event) {
      $("#cotizacion").off("hidden.bs.modal");
      // Open your second one in here

      swal({
        content: {
          element: "input"
        },
        text: "Asigna una cantidad",
        buttons: [true, "Aceptar"]
      })
        .then((cantidad) => {

          if (!cantidad) {
            $("#cotizacion").modal("toggle");
            return;
          }

          this._cotizacionService.productos[i].cantidad = Number(cantidad);

          //Actualizamos subtotales de cada producto en el carrito
          this.calcularTotal();
          $("#cotizacion").modal("toggle");
        })
        .catch();


    }.bind(this));
  }

  cambiarDescuento(index){
    $("#cotizacion").modal("toggle");
    $("#cotizacion").on("hidden.bs.modal", function (event) {
      $("#cotizacion").off("hidden.bs.modal");
      swal("Descuento", "Selecciona $ ó %", "info", {
        buttons: {
          monto: {
            text: "$",
            value: "monto"
          },
          porcentaje: {
            text: "%",
            value: "porcentaje"
          }
        }
      }).then(tipo => {
        swal({
          content: {
            element: "input",
            attributes: {
              type: "number"
            }
          },
          text: "Ingresa el descuento en " + tipo,
          buttons: [true, "Aceptar"]
        }).then(descuento => {
          if (tipo == "monto") {
            descuento=Number(descuento);
            if (descuento > this._cotizacionService.productos[index].precio) {
              
              swal(
                "Descuento",
                "El descuento, no puede ser mayor que el precio",
                "error"
              ).then(() => {
                $("#cotizacion").modal("toggle");
              });
              return;
              
            }

            this._cotizacionService.productos[index].descuento = Number(descuento);
            this.calcularTotal();
            $("#cotizacion").modal("toggle");

          } else {
            if (descuento >= 0 && descuento <= 100) {
              this._cotizacionService.productos[index].descuento =
                this._cotizacionService.productos[index].precio * (descuento / 100);
              this.calcularTotal();
              $("#cotizacion").modal("toggle");
            } else {
              swal(
                "Descuento",
                "El porcentaje debe ser un valor entre 0 y 100",
                "error"
              ).then(() => {
                $("#cotizacion").modal("toggle");
              });
            }
          }
        });
      });


    }.bind(this));
  }

  eliminarProducto(i){

    console.log(this.productos[i]);
    

    //Validamos si la imagen es custom o de un producto de catalogo
    //Si es custom la eliminamos    
    if ( this.productos[i].img && this.productos[i].img.includes('cotizacion')) {

      this._deleteImageService.eliminarImagenCotizacion(this.cotizacion._id, i)
        .subscribe(
          (resp) => {
            
            this._cotizacionService.eliminarProductoDeCotizacion(i);
            this.calcularTotal();
            this.actualizarCotizacion();
          });
    }else{
      this._cotizacionService.eliminarProductoDeCotizacion(i);
      this.calcularTotal();
      this.actualizarCotizacion();
    }

    

    
  }

  eliminarCotizacion(cotizacion){

    swal(
      "Confirmar eliminación",
      "Se eliminará la cotización, ¿Esta seguro de que desea continuar?",
      "warning",
      {
        buttons: {
          aceptar: {
            text: "Aceptar",
            value: true
          },
          cancelar: {
            text: "Cancelar",
            value: false
          }
        }
      }
    ).then(
      (eliminar) => {
        if (eliminar) {

          this._cotizacionService.eliminarCotizacion(cotizacion._id)
            .subscribe(
              (resp: any) => {
                
                this.obtenerCotizaciones(0);
                

                swal(
                  "Cotización eliminada",
                  "La cotizacion: " + resp.cotizacion._id + ", se ha eliminado exitosamente",
                  "success"
                );
              },
              (error) => {
                swal(
                  "Error al eliminar cotización",
                  error.error.mensaje + " | " + error.error.errors.message,
                  "error"
                );
              });

        } else {
          return;
        }
      });

    
    
  }



  imprimirCotizacion() {
    let cotizacion = document.getElementById("documento-cotizacion");
    let domClone = cotizacion.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

  guardarCotizacion() {
    let cotizacion= {
      proyecto: this.proyecto._id, 
      cliente: this.cliente._id, 
      fecha: new Date(), 
      productos: this._cotizacionService.productos, 
      subtotal: this.totalImporte, 
      descuento: this.totalDescuento, 
      total:  this.totalImporte - this.totalDescuento
    };

    this._cotizacionService.guardarCotizacion(cotizacion).subscribe(
      (resp:any)=>{
        
        this.cotizacion=resp.cotizacion;
        
        this.obtenerCotizaciones(this.cotizaciones.length);
        
        swal(
          "Cotización creada exitozamente",
          'La cotización se ha guardado de manera exitosa',
          'success'
        );
      },
      (err)=>{

      }
      );
  }

  clearFieldDescuento(evento: Event, i) {
    evento.srcElement.textContent = "";
    this._cotizacionService.productos[i].editandoDescuento = true;
  }

  clearFieldPrecio(evento: Event, i) {
    evento.srcElement.textContent = "";
    this._cotizacionService.productos[i].editandoPrecio = true;
  }

  clearFieldCantidad(evento: Event, i) {
    evento.srcElement.textContent = "";
    this._cotizacionService.productos[i].editandoCantidad = true;
  }

  calcularTotal() {
    
    let subtotal:number = 0;
    let descuento: number = 0;
    let total: number = 0;

    this._cotizacionService.productos.forEach(producto => {
      subtotal += producto.precio * producto.cantidad;
      descuento += (producto.descuento * producto.cantidad);

      
    });


    this.totalDescuento = descuento;
    this.totalImporte = subtotal;    

  }

  scrollTop() {
    let modal = document.getElementById('cotizacion');
    modal.scrollTop = 0;
  }

  formatNumber(monto: string) {
    let numeroString: string;
    let numeroNumber: number;
    //eliminando espacios
    numeroString = monto.trim().replace(" ", "");

    //eliminando símbolo $
    numeroString = numeroString.replace("$", "");

    //eliminando comas
    numeroString = numeroString.replace(",", "");

    //eliminando %
    numeroString = numeroString.replace("%", "");

    numeroNumber = Number(numeroString);
    return numeroNumber;
  }

  validarNota() {
    //Obteniendo todas las filas de la tabla y definiendo la variable de chequeo
    let rows = document
      .getElementById("tablaCotizacion")
      .getElementsByTagName("tbody")
      .item(0)
      .getElementsByTagName("tr");

    let notaValida: boolean = true;

    //Iteramos las filas para validar que las columnas de numero sean numeros
    for (let fila = 1; fila < rows.length - 1; fila++) {
      let row = rows[fila];
      let celdas = row.getElementsByTagName("td");

      console.log(celdas);

      let producto = celdas.item(1).innerText;
      let descripcion = celdas.item(2).innerText;

      let cantidad = this.formatNumber(celdas.item(3).innerText);
      let descuento = this.formatNumber(celdas.item(4).innerText);
      let precio = this.formatNumber(celdas.item(5).innerText);
      let importe = this.formatNumber(celdas.item(6).innerText);

      //Si alguna no es un número seteamos la variable de chequeo a falso y rompemos el ciclo
      if (
        Number.isNaN(cantidad) ||
        Number.isNaN(precio) ||
        Number.isNaN(importe) ||
        Number.isNaN(descuento)
      ) {
        notaValida = false;
        $(function() {
          $('[data-toggle="tooltip"]').tooltip();
        });
        break;
      }
    }

    //Seteamos el valor de la variable del componente "notaValida"
    //al valor de nuestra variable de chequeo (true/false)
    this.notaValida = notaValida;
  }

  loseFocusDescuento(index) {
    let celda = document
      .getElementsByTagName("tr")
      .item(index + 1)
      .getElementsByTagName("td")
      .item(4);

    let descuento = this.formatNumber(celda.textContent);

    if (Number.isNaN(descuento) || this._cotizacionService.productos[index].cantidad == 0) {
      celda.innerText = "0";
      this._cotizacionService.productos[index].descuento = 0;
    } else {
      celda.innerText = descuento.toString();
      this._cotizacionService.productos[index].descuento = descuento;
    }

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this._cotizacionService.productos[index].editandoDescuento = false;
  }

  loseFocusPrecio(index) {
    let celda = document
      .getElementsByTagName("tr")
      .item(index + 1)
      .getElementsByTagName("td")
      .item(5);

    let precio = this.formatNumber(celda.textContent);

    if (Number.isNaN(precio) || precio == 0) {
      celda.innerText = formatCurrency(
        this._cotizacionService.productos[index].precio,
        "es-Mx",
        "$"
      ).toString();
    } else {
      celda.innerText = formatCurrency(precio, "es-Mx", "$").toString();
    }

    //Actualizamos descuento
    let cantidad = this._cotizacionService.productos[index].cantidad;
    let factorDescuento = this._cotizacionService.productos[index].factorDescuento;
    this._cotizacionService.productos[index].descuento =
      cantidad * precio * (factorDescuento / 100);

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this._cotizacionService.productos[index].editandoPrecio = false;
  }

  loseFocus(index) {
    let celda = document
      .getElementsByTagName("tr")
      .item(index + 1)
      .getElementsByTagName("td")
      .item(3);

    let cantidad = this.formatNumber(celda.textContent);

    if (Number.isNaN(cantidad)) {
      celda.textContent = this._cotizacionService.productos[index].cantidad;
    } else {
      celda.textContent = this._cotizacionService.productos[index].cantidad;
    }

    //Actualizamos descuento
    let precio = this._cotizacionService.productos[index].precio;
    let factorDescuento = this._cotizacionService.productos[index].factorDescuento;
    this._cotizacionService.productos[index].descuento =
      cantidad * precio * (factorDescuento / 100);

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this._cotizacionService.productos[index].editandoCantidad = false;
  }

  actualizarPrecio(evento: Event, index) {
    let precio = this.formatNumber(evento.srcElement.textContent);

    if (Number.isNaN(precio) || precio == 0) {
    } else {
      this._cotizacionService.productos[index].precio = precio;
      this._cotizacionService.productos[index].importe =
        this._cotizacionService.productos[index].cantidad * this._cotizacionService.productos[index].precio;
    }
  }

  actualizarDescuento(evento: Event, index) {
    //Eliminando espacios en blanco del texto recibido en el campo cantidad
    let descuento = evento.srcElement.textContent.trim().replace(" ", "");

    //Transformando el inner text a un numero
    let descuentoNumero = Number(descuento);

    //Validando si el número es un entero, cantidad no esta vacío y es un número
    if (
      Number.isInteger(descuentoNumero) &&
      descuento != "" &&
      !Number.isNaN(descuentoNumero)
    ) {
      //Guardamos la nueva cantidad en nuestro arreglo de productos
      let precio = this._cotizacionService.productos[index].precio;
      let cantidad = this._cotizacionService.productos[index].cantidad;
      this._cotizacionService.productos[index].factorDescuento = descuentoNumero;

      let calculoDescuento = (descuentoNumero / 100) * precio * cantidad;

      if (cantidad > 0) {
        this._cotizacionService.productos[index].descuento = calculoDescuento;
      }
    } else {
      //Si es texto igualamos el factor de descuento a cero

      this._cotizacionService.productos[index].factorDescuento = 0;
      let precio = this._cotizacionService.productos[index].precio;
      let cantidad = this._cotizacionService.productos[index].cantidad;
      let calculoDescuento = (descuentoNumero / 100) * precio * cantidad;

      if (cantidad > 0) {
        this._cotizacionService.productos[index].descuento = calculoDescuento;
      }
    }
  }

  actualizandoCantidad(evento: Event, index) {
    //Eliminando espacios en blanco del texto recibido en el campo cantidad
    let cantidad = evento.srcElement.textContent.trim().replace(" ", "");

    //Transformando el inner text a un numero
    let cantidadNumero = Number(cantidad);

    //Validando si el número es un entero, cantidad no esta vacío y es un número
    if (
      Number.isInteger(cantidadNumero) &&
      cantidad != "" &&
      !Number.isNaN(cantidadNumero)
    ) {
      //Guardamos la nueva cantidad en nuestro arreglo de productos
      this._cotizacionService.productos[index].cantidad = cantidadNumero;
      this._cotizacionService.productos[index].importe =
        cantidadNumero * this._cotizacionService.productos[index].precio;
    } else {
      //Si es texto igualamos al input recibido sin espacios
    }
  }
}
