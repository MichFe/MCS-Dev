import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CotizacionService } from 'src/app/services/cotizacion/cotizacion.service';

declare var $:any;

@Component({
  selector: 'app-tabla-cotizaciones',
  templateUrl: './tabla-cotizaciones.component.html',
  styleUrls: ['./tabla-cotizaciones.component.css']
})
export class TablaCotizacionesComponent implements OnInit,OnChanges {

  //variables
  cotizaciones: any[] = [];

  @Input()
  proyecto:any;

  @Output()
  actualizarIndexCotizacion: EventEmitter<any> = new EventEmitter;

  @Output()
  recargarProyecto: EventEmitter<any> = new EventEmitter;

  constructor(
    public _cotizacionService:CotizacionService
  ) {
    this.cotizaciones = this._cotizacionService.cotizaciones;
   }

  ngOnInit() {
    this.cotizaciones=this._cotizacionService.cotizaciones;
  }

  ngOnChanges(): void {
    

    if (this.proyecto.nombre) {
      this.obtenerCotizaciones();
    }else{
      this._cotizacionService.actualizarCotizaciones([]);
    }

  }


  eliminarCotizacion(cotizacion) {

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

                this.obtenerCotizaciones();
                this.recargarProyecto.emit();

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

  mostrarDetalleCotizacion(i){
    this.actualizarIndexCotizacion.emit(i);
    $('#cotizacion').modal('toggle');
  }

  obtenerCotizaciones() {
    this._cotizacionService.obtenerCotizacion(this.proyecto._id).subscribe(
      (resp: any) => {

        if (resp.cotizacion.length == 0) {
          // this.cotizaciones = [];
          this._cotizacionService.actualizarCotizaciones([]);
          
        
          
          
        }else{
          this._cotizacionService.actualizarCotizaciones(resp.cotizacion);

        }


      },
      (err) => {
       
        // this.cotizaciones = [];
        this._cotizacionService.actualizarCotizaciones([]);

      }
    );
  }

}
