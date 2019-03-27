import { Component, OnInit, ViewChild } from '@angular/core';
import { Requisicion } from '../../models/requisicion.model';
import { DetalleRequisicionComponent } from '../modal/detalle-requisicion/detalle-requisicion.component';
import { RequisicionesService } from '../../services/requisiciones/requisiciones.service';
import swal from 'sweetalert';
import { SidebarService } from 'src/app/services/sidebar.service';
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
    private _sideBarService:SidebarService
    ) { }

  ngOnInit() {
    this.obtenerRequisicionesPorAprobar(1);
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
