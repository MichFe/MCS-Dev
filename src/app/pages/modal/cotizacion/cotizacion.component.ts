import { Component, OnInit, Input } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
declare var $:any;

@Component({
  selector: "app-cotizacion",
  templateUrl: "./cotizacion.component.html",
  styleUrls: ["./cotizacion.component.css"]
})
export class CotizacionComponent implements OnInit {
  //Inputs
  @Input()
  proyecto: any = {};

  @Input()
  cliente: any = {};

  //Variables
  fecha: number = Date.now();
  notaValida: boolean = true;
  totalImporte: number = 0;
  totalDescuento: number = 0;

  //Productos de la nota
  productos: any[] = [
    {
      nombre: "Sillón Murcielago",
      descripcion: "Sillón inspirado en las alas de los murcielagos",
      precio: 8000,
      cantidad: 0,
      descuento: 0,
      factorDescuento: 0,
      importe: 0,
      editandoCantidad: false,
      editandoPrecio: false,
      editandoDescuento: false
    },
    {
      nombre: "Sillón Murcielago",
      descripcion: "Sillón inspirado en las alas de los murcielagos",
      precio: 8000,
      cantidad: 0,
      descuento: 0,
      factorDescuento: 0,
      importe: 0,
      editandoCantidad: false,
      editandoPrecio: false,
      editandoDescuento: false
    }
  ];

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

  constructor(private cotizacion: SharedService) {}

  ngOnInit() {}

  resetearModal() {}

  imprimirCotizacion() {
    let cotizacion = document.getElementById("documento-cotizacion");
    let domClone = cotizacion.cloneNode(true);
    let printSection = document.getElementById("printSection");

    printSection.innerHTML = "";
    printSection.appendChild(domClone);

    window.print();
  }

  guardarCotizacion() {}

  clearFieldDescuento(evento: Event, i) {
    evento.srcElement.textContent = "";
    this.productos[i].editandoDescuento = true;
  }

  clearFieldPrecio(evento: Event, i) {
    evento.srcElement.textContent = "";
    this.productos[i].editandoPrecio = true;
  }

  clearFieldCantidad(evento: Event, i) {
    evento.srcElement.textContent = "";
    this.productos[i].editandoCantidad = true;
  }

  calcularTotal() {
    let total: number = 0;
    let descuento: number = 0;

    this.productos.forEach(producto => {
      total += producto.importe;
      descuento += producto.descuento;
    });

    this.totalDescuento = descuento;
    this.totalImporte = total;
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

    if (Number.isNaN(descuento) || this.productos[index].cantidad == 0) {
      celda.innerText = "0";
      this.productos[index].factorDescuento = 0;
    } else {
      celda.innerText = descuento.toString();
      this.productos[index].factorDescuento = descuento;
    }

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this.productos[index].editandoDescuento = false;
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
        this.productos[index].precio,
        "es-Mx",
        "$"
      ).toString();
    } else {
      celda.innerText = formatCurrency(precio, "es-Mx", "$").toString();
    }

    //Actualizamos descuento
    let cantidad = this.productos[index].cantidad;
    let factorDescuento = this.productos[index].factorDescuento;
    this.productos[index].descuento =
      cantidad * precio * (factorDescuento / 100);

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this.productos[index].editandoPrecio = false;
  }

  loseFocus(index) {
    let celda = document
      .getElementsByTagName("tr")
      .item(index + 1)
      .getElementsByTagName("td")
      .item(3);

    let cantidad = this.formatNumber(celda.textContent);

    if (Number.isNaN(cantidad)) {
      celda.textContent = this.productos[index].cantidad;
    } else {
      celda.textContent = this.productos[index].cantidad;
    }

    //Actualizamos descuento
    let precio = this.productos[index].precio;
    let factorDescuento = this.productos[index].factorDescuento;
    this.productos[index].descuento =
      cantidad * precio * (factorDescuento / 100);

    this.validarNota();
    this.calcularTotal();

    celda.blur();
    this.productos[index].editandoCantidad = false;
  }

  actualizarPrecio(evento: Event, index) {
    let precio = this.formatNumber(evento.srcElement.textContent);

    if (Number.isNaN(precio) || precio == 0) {
    } else {
      this.productos[index].precio = precio;
      this.productos[index].importe =
        this.productos[index].cantidad * this.productos[index].precio;
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
      let precio = this.productos[index].precio;
      let cantidad = this.productos[index].cantidad;
      this.productos[index].factorDescuento = descuentoNumero;

      let calculoDescuento = (descuentoNumero / 100) * precio * cantidad;

      if (cantidad > 0) {
        this.productos[index].descuento = calculoDescuento;
      }
    } else {
      //Si es texto igualamos el factor de descuento a cero

      this.productos[index].factorDescuento = 0;
      let precio = this.productos[index].precio;
      let cantidad = this.productos[index].cantidad;
      let calculoDescuento = (descuentoNumero / 100) * precio * cantidad;

      if (cantidad > 0) {
        this.productos[index].descuento = calculoDescuento;
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
      this.productos[index].cantidad = cantidadNumero;
      this.productos[index].importe =
        cantidadNumero * this.productos[index].precio;
    } else {
      //Si es texto igualamos al input recibido sin espacios
    }
  }
}
