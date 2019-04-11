import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';
declare var $:any;

@Component({
  selector: "app-modal-editar-gasto",
  templateUrl: "./modal-editar-gasto.component.html",
  styleUrls: ["./modal-editar-gasto.component.css"]
})
export class ModalEditarGastoComponent implements OnInit {
  //Variables
  proveedorSeleccionado: any;
  fecha=new Date();

  //Variables de formulario
  proveedorNombre: string = "";
  monto: number;
  fechaString: string;
  descripcion: string;
  categoria: string;

  //Data
  proveedores: any[] = [];

  //Inputs
  @Input()
  gasto: any = {};

  //Outputs
  @Output()
  actualizarData:EventEmitter<any> = new EventEmitter; 

  constructor(
    private _proveedorService: ProveedorService,
    private _gastoService: GastoService
    ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    let existeGasto = Object.getOwnPropertyNames(this.gasto).includes(
      "proveedor"
    );
    if (!existeGasto) {
      return;
    }

    this.proveedorNombre = this.gasto.proveedor.nombre;
    this.monto = this.gasto.monto;
    this.fecha = new Date(this.gasto.fecha);
    this.cargarFechaString();
    this.descripcion = this.gasto.descripcion;
    this.categoria = this.gasto.categoria;
  }

  resetearModal() {
    this.proveedorSeleccionado=null;
  }

  buscarProveedor() {
    let termino = this.proveedorNombre;

    if (termino.length === 0) {
      this.proveedores = [];
      return;
    }

    if (termino.length < 3) {
      return;
    }
    this._proveedorService.buscarProveedor(termino).subscribe(
      (resp: any) => {
        this.proveedores = resp.proveedor;
      },
      error => {
        swal(
          "Error al Buscar Proveedor",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  seleccionarProveedor(proveedor) {
    this.proveedorSeleccionado = proveedor;
    this.proveedorNombre = proveedor.nombre;
    this.proveedores = [];
  }

  abrirRegistroDeProveedor(evento) {
    $("#modalEdicionDeGasto").on("hidden.bs.modal", function(event) {
      // Open your second one in here
      $("#modalNuevoProveedor").modal("toggle");
      $("#modalEdicionDeGasto").off("hidden.bs.modal");

      $("#modalNuevoProveedor").on("hidden.bs.modal", function(event) {
        $("#modalEdicionDeGasto").modal("toggle");
        $("#modalNuevoProveedor").off("hidden.bs.modal");
      });
    });

    $("#modalEdicionDeGasto").modal("toggle");
  }

  cargarFechaString() {    
    let year = this.fecha.getFullYear();
    let mes = this.fecha.getMonth();
    let dia = this.fecha.getDate();
    mes = mes + 1;
    let mesString: string;
    let diaString: string;

    if (mes < 10) {
      mesString = '0' + mes;
    } else {
      mesString = String(mes);
    }

    if (dia < 10) {
      diaString = '0' + dia;
    } else {
      diaString = String(dia);
    }


    this.fechaString = `${year}-${mesString}-${diaString}`;
  }

  cambiarFecha() {
    this.fecha = new Date();

    let horas = this.fecha.getHours();
    let minutos = this.fecha.getMinutes();

    let fechaArray = this.fechaString.split("-");
    this.fecha = new Date(
      Number(fechaArray[0]),
      Number(fechaArray[1]) - 1,
      Number(fechaArray[2]),
      horas,
      minutos
    );
  }

  actualizarGasto() {
    
    let gastoActualizado = {
      _id: this.gasto._id,
      proveedor: (this.proveedorSeleccionado) ? this.proveedorSeleccionado._id : this.gasto.proveedor._id,
      descripcion: this.descripcion, 
      categoria: this.categoria, 
      monto: this.monto, 
      fecha: this.fecha
    };

    this._gastoService.actualizarGasto(gastoActualizado)
      .subscribe(
        (resp)=>{
          this.actualizarData.emit();
          $("#modalEdicionDeGasto").modal('toggle');

          swal(
            "Gasto actualizado",
            "El gasto se ha actualizado correctamente",
            "success"
            );
      },
      (error)=>{
        swal(
          "Error al actualizar Gasto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }
}
