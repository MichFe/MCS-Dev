import { Component, OnInit, ViewChild } from '@angular/core';
import { RequisicionesService } from '../../services/requisiciones/requisiciones.service';
import { Requisicion } from '../../models/requisicion.model';
import { DetalleRequisicionComponent } from '../modal/detalle-requisicion/detalle-requisicion.component';
import swal from 'sweetalert';
import { OrdenCompraService } from 'src/app/services/ordenCompra/orden-compra.service';

declare var $: any;

@Component({
  selector: 'app-requisisiones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.css']
})


export class RequisicionesComponent implements OnInit {
  // Variables
  public totalProductos: number;
  public paginaActual: number;
  public requisiciones: Requisicion[];
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


  constructor(
    private _requisicionesService: RequisicionesService,
    private _comprasService: OrdenCompraService
    ) {
  }

  ngOnInit() {
    this.obtenerRequisiciones(1);
  }

  confirmarRecepcionDeProdcuto(requisicion){
    if(requisicion.estatus==='Recibido'){
      swal(
        "Pedido ya confirmado",
        "La recepción del pedido ya ha sido confirmada anteriormente",
        "warning"
      );
      return;
    }

    if(requisicion.estatus != 'Pedido'){
      swal(
        "Pedido aún no realizado",
        "No es posible confirmar la recepción de un pedido que aún no se ha realizado",
        "warning"
      );

      return;
    }

    requisicion.estatus ='Recibido';

    this._requisicionesService.actualizarRequisicion(requisicion)
      .subscribe((resp:any)=>{
        let requisicionActualizada = resp.requisicion;

        this._comprasService.buscarCompraPorId(requisicion.compra)
          .subscribe((resp:any)=>{

            let compra = resp.compra;
            
            compra.requisiciones.forEach((req,index) => {
              if(req._id===requisicion._id){
                compra.requisiciones[index].estatus = 'Recibido';
              }
            });
            
            let requisicionesConProductoRecibido = 0;

            compra.requisiciones.forEach((req) => {
              
              if (req.estatus === 'Recibido') {
                requisicionesConProductoRecibido += 1;
              }  
            });

            if(requisicionesConProductoRecibido >= compra.requisiciones.length){
              compra.estatusPedido = 'Recibido';
              compra.fechaReciboMercancia = new Date();
            }

            this._comprasService.actualizarCompra(compra)
              .subscribe((resp:any)=>{
                swal(
                  "Requisición y Orden de Compra actualizadas",
                  "El estatus de la requisición y ordend de comrpa se ha actuañizado a recibido",
                  "success"
                );
              },
              (error)=>{
                swal(
                  'Error al actualizar compra de la requisición',
                  error.error.mensaje + ' | ' + error.error.errors.message,
                  'error'
                );
              });
            
          },
          (error)=>{
            swal(
              'Error al buscar compra de la requisición',
              error.error.mensaje + ' | ' + error.error.errors.message,
              'error'
            );
          });
      },
      (error)=>{
        swal(
          'Error al actualizar requisición',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      });
  }

  agregarRequisision(requisicion: Requisicion = null) {
    this.requisicion = requisicion;
    this.child._requisicion = this.requisicion;
    this.child.setRequisicion();
    $('#detalleRequisicion').modal('toggle');
  }

  obtenerRequisiciones(pagina: number) {
    this._requisicionesService.obtenerRequisicionesDelUsuario(pagina).subscribe(
      (resp: any) => {
        this.requisiciones = resp.requisiciones;
        this.totalElementos = resp.totalReqisiciones;
        this.activarPaginaActual(pagina);
        this.paginarResultados();
        // this.requisiciones.sort((a, b) => (a.fechaSolicitud > b.fechaSolicitud) ? 1 : ((b.fechaSolicitud > a.fechaSolicitud) ? -1 : 0)).reverse();
        // Arignar datos a tabla
      },
      error => {
        swal(
          'Error al consultar las compras',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      }
    );
  }

  cargarElementosPagina(pagina) {
    this._requisicionesService.obtenerRequisicionesDelUsuario(pagina).subscribe(
      (resp: any) => {
        this.requisiciones = resp.requisiciones;
        this.totalElementos = resp.totalReqisiciones;
        this.activarPaginaActual(pagina);
        // this.requisiciones.sort((a, b) => (a.fechaSolicitud > b.fechaSolicitud) ? 1 : ((b.fechaSolicitud > a.fechaSolicitud) ? -1 : 0)).reverse();
        // Arignar datos a tabla
      },
      error => {
        swal(
          'Error al consultar requisiciones',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      }
    );
  }

  eliminarRequisicion(requisicion){

    swal(
      "Confirmar eliminación",
      "Se eliminará la requisición, ¿Esta seguro de que desea continuar?",
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

          this._requisicionesService.eliminarRequisiciones(requisicion)
            .subscribe((resp) => {

              this.cargarElementosPagina(this.paginaActual);

              swal(
                "Requisición Eliminada",
                "La requisición se ha eliminado correctamente",
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
  //Funciones de paginado
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
}
