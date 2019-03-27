import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UsuarioService} from 'src/app/services/usuarios/usuario.service';
import {RequisicionesService} from 'src/app/services/requisiciones/requisiciones.service';
import {UnidadNegocio} from 'src/app/enums/unidadNegocio.enum';
import {Requisicion} from 'src/app/models/requisicion.model';
import {EstatusRequisicion} from '../../../enums/estatusRequisicion.enum';
import swal from 'sweetalert';

declare var $: any;

@Component({
  selector: 'app-detalle-requisicion',
  templateUrl: './detalle-requisicion.component.html',
  styleUrls: ['./detalle-requisicion.component.css']
})
export class DetalleRequisicionComponent implements OnInit {
  precio: number;
  usuarioCreador: string;
  usuarioUltimaModificacion: string;


  @Output()
  refreshCompras: EventEmitter<any> = new EventEmitter();

  @Input()
  _requisicion: Requisicion;

  UnidadesDeNegocio: any[] = [
    UnidadNegocio.Fabrica,
    UnidadNegocio.TiendaLeon,
    UnidadNegocio.TiendaGuadalajara
  ];

  formaValida = false;
  public descripcion: string;
  public cantidad: string;
  public solicitante: string;
  public unidadDeNegocio = '';
  public fechaSolicitud: Date;
  public aprobador: string;
  public accion = 'Registrar';

  constructor(
    public _usuarioService: UsuarioService,
    public _requisicionService: RequisicionesService
  ) {
    this.solicitante = this._usuarioService.usuario.nombre;
  }

  ngOnInit() {
    this.usuarioCreador = this._usuarioService.id;
    this.usuarioUltimaModificacion = this._usuarioService.id;
  }

  public setRequisicion() {
    if (this._requisicion !== null && this._requisicion !== undefined) {
      this.descripcion = this._requisicion.descripcion;
      this.cantidad = this._requisicion.cantidad;
      this.unidadDeNegocio = this._requisicion.unidadDeNegocio;
      this.aprobador = this._requisicion.aprobador;
      this.accion = 'Aprobar';
    }
  }

  resetearModal() {
    this.descripcion = null;
    this.cantidad = null;
    this.unidadDeNegocio = null;
    this.fechaSolicitud = null;
    this.accion = 'Registrar';
  }

  guardarRequisicion(forma) {

    //Validamos campos llenos
    if(forma.descripcion=='' || forma.cantidad=='',forma.unidadDeNegocio==''){
      swal(
        'Forma inválida',
        'Favor de completar los campos del formulario',
        'warning'
      );
    }
    // Creamos el objeto requisicion con la información de la forma
    let requisicion: any;
    requisicion = new Requisicion(
      forma.descripcion,
      forma.cantidad,
      this._usuarioService.usuario,
      this.unidadDeNegocio,
      new Date(),
      null
    );
    this.registrarNuevaRequisicion(requisicion);
  }

  private registrarNuevaRequisicion(requisicion: Requisicion) {
    // Ejecutamos la petición POST para crear la requisicion
    this._requisicionService.guardarRequisicion(requisicion).subscribe(
      (resp: any) => {
        swal(
          'Requisición registrada exitosamente',
          'La requisición: ' + requisicion.descripcion + ' se registró exitosamente',
          'success'
        );
        this.refreshCompras.emit(true);
        $('#detalleRequisicion').modal('toggle');
        this.resetearModal();
      },
      error => {
        swal('Error al registrar producto',
          error.error.mensaje + ' | ' + error.error.errors.message, 'error');
      }
    );
  }

  actualizarInformacionDeRequisicion(){
    let requisicion={
      descripcion:this.descripcion,
      cantidad: this.cantidad,
      unidadDeNegocio: this.unidadDeNegocio,
      _id: this._requisicion._id
    };

    this._requisicionService.actualizarRequisicion(requisicion)
      .subscribe((resp:any)=>{
        this.refreshCompras.emit();
        swal(
          'Requisición Actualizada',
          'La requisición se ha actualizado correctamente',
          'success'
          );
      },
      (error)=>{
        swal(
          'Error al actualizar la requisición',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error');
      });
  }

  public actualizarRequisicion(estatusReq: Boolean) {
    let fechaActual=new Date();

    let requisicion = {
      aprobador: this._usuarioService.id,
      estatus: (estatusReq)? EstatusRequisicion.Aprobada : EstatusRequisicion.Rechazada,
      fechaAprobacionRechazo:fechaActual,
      _id: this._requisicion._id
    };

// Ejecutamos la petición PUT para actualizar la requisicion
    swal(
      'Actualización',
      '¿Está seguro de ' + (estatusReq ? 'Aprobar' : 'Rechazar') + ' la requisición?',
      'warning', {
      buttons: {
        Aprobar: {
          text: 'Si, ' + (estatusReq ? 'Aprobar' : 'Rechazar'),
          value: 'confirmado',
          className: 'btn-success'
        },
        Rechazar: {
          text: 'No, regresar',
          value: 'cancelar',
          className: 'btn-danger'
        }
      },

    }).then(isConfirm => {
      if (isConfirm === 'confirmado') {
        this._requisicionService.actualizarRequisicion(requisicion).subscribe(
          (resp: any) => {
            swal('Actualización de Requisición ',
              'La requisición: se ' + (estatusReq ? 'aprobó' : 'rechazo') + ' exitosamente',
              'success'
            );
            $('#detalleRequisicion').modal('toggle');
            this.resetearModal();
            this.refreshCompras.emit(true);
          },
          error => {
            swal(
              'Error al actualizar la requisición',
              error.error.mensaje + ' | ' + error.error.errors.message, 
              'error');
          });
      } else {
        return;
        // swal('Cancelado', 'No se actualizó la requisición', 'error');
      }
    });
  }
}
