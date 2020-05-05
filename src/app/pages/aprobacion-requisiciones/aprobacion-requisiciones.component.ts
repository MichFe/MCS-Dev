import { Component, OnInit, ViewChild } from '@angular/core';
import { Requisicion } from '../../models/requisicion.model';
import { DetalleRequisicionComponent } from '../modal/detalle-requisicion/detalle-requisicion.component';
import { RequisicionesService } from '../../services/requisiciones/requisiciones.service';
import swal from 'sweetalert';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
declare var $: any;

@Component({
  selector: 'app-aprobacion-requisiciones',
  templateUrl: './aprobacion-requisiciones.component.html',
  styleUrls: ['./aprobacion-requisiciones.component.css']
})
export class AprobacionRequisicionesComponent implements OnInit {
  // Variables
  public totalProductos: number;
  public paginaActual: number;
  public requisicion: Requisicion;
  public selectedRow: any;
  public currentPage = 1;
  public totalElementos = 0;
  // Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  @ViewChild(DetalleRequisicionComponent) child;
  public requisiciones: Requisicion[];

  constructor(
    private _requisicionesService: RequisicionesService,
    private _sideBarService:SidebarService,
    private _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    this.obtenerRequisicionesPorAprobar(1);
  }

  aprobarRequisicionesSeleccionadas(){

    let requisicionesSeleccionadas = [];

    this.requisiciones.forEach((requisicion) => {
      if (requisicion.seleccionada) {
        requisicionesSeleccionadas.push(requisicion);
      }
    });

    if (requisicionesSeleccionadas.length === 0) {
      return;
    }

    swal(
      'Actualización',
      '¿Está seguro de que desea aprobar las requisiciones seleccionadas?',
      'warning', {
        buttons: {
          Aprobar: {
            text: 'Si, Aprobar',
            value: 'confirmado',
            className: 'btn-success'
          },
          Rechazar: {
            text: 'No, regresar',
            value: 'cancelar',
            className: 'btn-danger'
          }
        },

      }).then( isConfirm => {
        if (isConfirm === 'confirmado') {

          let aprobadasCorrectamente = 0;
          let erroresAlAprobar = 0;

         requisicionesSeleccionadas.forEach(async (requisicion, i)=>{

            let aprobada = await this.aprobarUnaRequisicion(requisicion);
            
            if(aprobada){
              aprobadasCorrectamente= aprobadasCorrectamente + 1
            }else{
              erroresAlAprobar = erroresAlAprobar + 1;
            };

            //Ultima ejecución
            if(i>=(requisicionesSeleccionadas.length-1)){
              if(erroresAlAprobar === 0){
                swal(
                  "Aprobaciones exitosas",
                  `Se han aprobado ${ aprobadasCorrectamente } requisiciones`,
                  "success"
                );
              }else{
                swal(
                  "Errores al aprobar",
                  `Se aprobaron correctamente: ${aprobadasCorrectamente} requisiciones | No se aprobaron: ${erroresAlAprobar} requisiciones`,
                  "warning"
                );
              }
              this.obtenerRequisicionesPorAprobar(this.paginaActual);
              this._sideBarService.obtenerTotalRequisicionesPorAprobar();
            }
            
          });

        } else {
          return;
          // swal('Cancelado', 'No se actualizó la requisición', 'error');
        }
      });
  }

  rechazarRequisicionesSeleccionadas(){
    let requisicionesSeleccionadas = [];

    this.requisiciones.forEach((requisicion) => {

      if (requisicion.seleccionada) {
        requisicionesSeleccionadas.push(requisicion);
      }

    });

    if (requisicionesSeleccionadas.length === 0) {
      return;
    }
    
    swal(
      'Actualización',
      '¿Está seguro de que desea rechazar las requisiciones seleccionadas?',
      'warning', {
        buttons: {
          Aprobar: {
            text: 'Si, Rechazar',
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

          let rechazadasCorrectamente = 0;
          let erroresAlRechazar = 0;

          requisicionesSeleccionadas.forEach(async (requisicion, i) => {

            let aprobada = await this.rechazarUnaRequisicion(requisicion);

            if (aprobada) {
              rechazadasCorrectamente = rechazadasCorrectamente + 1
            } else {
              erroresAlRechazar = erroresAlRechazar + 1;
            };

            //Ultima ejecución
            if (i >= (requisicionesSeleccionadas.length - 1)) {
              if (erroresAlRechazar === 0) {
                swal(
                  "Rechazos exitosos",
                  `Se han rechazado ${rechazadasCorrectamente} requisiciones`,
                  "success"
                );
              } else {
                swal(
                  "Errores al rechazar",
                  `Se rechazaron correctamente: ${rechazadasCorrectamente} requisiciones | No se rechazaron: ${erroresAlRechazar} requisiciones`,
                  "warning"
                );
              }
              this.obtenerRequisicionesPorAprobar(this.paginaActual);
            }

          });

        } else {
          return;
          // swal('Cancelado', 'No se actualizó la requisición', 'error');
        }
      });
  }

  aprobarUnaRequisicion(requisicion){

    let fechaActual = new Date();

      requisicion.aprobador = this._usuarioService.id;
      requisicion.estatus = 'Aprobada';
      requisicion.fechaAprobacionRechazo = fechaActual;

    return new Promise((resolve, reject)=>{
      this._requisicionesService.actualizarRequisicion(requisicion).subscribe(
        (resp: any) => {
          resolve(true);
        },
        error => {
          reject(false);
        });
    });
    

  }

   rechazarUnaRequisicion(requisicion){

    let fechaActual = new Date();

      requisicion.aprobador = this._usuarioService.id;
     requisicion.estatus = 'Rechazada';
      requisicion.fechaAprobacionRechazo = fechaActual;

    return new Promise((resolve, reject)=>{
      this._requisicionesService.actualizarRequisicion(requisicion).subscribe(
        (resp: any) => {
          resolve(true);
        },
        error => {
          reject(false);
        });
    });
    

  }

  detalleRequisicion(requisicion: Requisicion) {
    this.requisicion = requisicion;
    this.child._requisicion = this.requisicion;
    this.child.setRequisicion();
    $('#detalleRequisicion').modal('toggle');
  }

  obtenerRequisicionesPorAprobar(pagina: number){
    this._requisicionesService.obtenerRequisicionesPorAprobar(pagina)
      .subscribe(
        (resp:any)=>{
          this.requisiciones=resp.requisiciones;
          this.totalElementos = resp.totalReqisiciones;
          //Actualizar total de requisiciones por aprobar en el sidebar
          this._sideBarService.obtenerTotalRequisicionesPorAprobar();
          this.paginarResultados();
          this.activarPaginaActual(pagina);
      },
        error => {
          swal(
            'Error al consultar requisiciones por aprobar',
            error.error.mensaje + ' | ' + error.error.errors.message,
            'error'
          );
        });
  }

  cargarElementosPagina(pagina) {

    this.obtenerRequisicionesPorAprobar(pagina);
    this.activarPaginaActual(pagina);
  }

  activarPaginaActual(paginaClickeada) {
    this.paginas.forEach(pagina => {
      if (paginaClickeada === pagina.pagina) {
        pagina.active = true;
        this.paginaActual = pagina.pagina;
      } else {
        pagina.active = false;
      }
    });
  }

  paginaAnterior() {
    const paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    this.cargarElementosPagina(paginaActual.pagina - 1);
  }

  paginaSiguiente() {
    const paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina * 10 >= this.totalElementos) {
      return;
    }
    this.cargarElementosPagina(paginaActual.pagina + 1);
  }

  paginarResultados() {
    // Validamos que existan requisiciones
    if (!this.totalElementos) {
      return;
    }

    this.paginas = [];
    const numeroDePaginas = Math.ceil(this.totalElementos / 10);
    let objetoPagina;

    for (let pagina = 1; pagina <= numeroDePaginas; pagina++) {
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginas.push(objetoPagina);

    }

    this.paginas[0].active = true;
  }

  actualizar(req: Requisicion, index) {
    this.selectedRow = index;
    this.detalleRequisicion(req);
  }

}
