import {Component, OnInit, ViewChild} from '@angular/core';
import {Requisicion} from '../../models/requisicion.model';
import {RequisicionesService} from '../../services/requisiciones/requisiciones.service';
import swal from 'sweetalert';
import { OrdenCompraService } from 'src/app/services/ordenCompra/orden-compra.service';
import { OrdenCompraComponent } from '../modal/orden-compra/orden-compra.component';
declare var $: any;

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  //Childs
  @ViewChild(OrdenCompraComponent) modalCompra;

  // Variables
  public totalProductos: number;
  public paginaActual: number;
  public requisicion: Requisicion;
  public selectedRow: any;
  public currentPage = 1;
  public totalElementos = 0;
  totalCompras: number;
  totalTodasLasCompras:number;
  compra:any;
  requisicionesSeleccionadas=[];

  //Variables Paginado de Compras
  paginaActualCompras:number;
  paginasCompras:any[]=[
    {
      pagina: 1,
      active: false
    }
  ];

  //Variables Paginado de Compras
  paginaActualTodasLasCompras: number;
  paginasTodasLasCompras: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  //Data
  requisicionesAprobadas: Requisicion[];
  compras:any[]=[];
  todasLasCompras:any[]=[];

  // Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  // @ViewChild(DetalleRequisicionComponent) child;

  constructor(
    private _requisicionesService: RequisicionesService,
    private _comprasService: OrdenCompraService
    ) { }

  ngOnInit() {
    this.obtenerRequisicionesAprobadas(1);
    this.obtenerCompras(1);
    this.obtenerTodasLasCompras(1);
  
  }

  actualizarData(){
    this.obtenerRequisicionesAprobadas(1);
    this.obtenerCompras(1);
    this.obtenerTodasLasCompras(1);
    this.actualizarCompraActual();
    
  }

  actualizarCompraActual(){
    this._comprasService.buscarCompraPorId( this.compra._id ).subscribe(
      (resp:any)=>{
        
        this.compra = resp.compra;

      },
      (error)=>{
        swal(
          'Error al consultar las requisiciones',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      });
  }

  registrarCliente(){
    $('#modalNuevoProveedor').modal('toggle');
  }

  obtenerRequisicionesAprobadas(pagina:number){
    this._requisicionesService.obtenerRequisicionesAprobadas(pagina)
      .subscribe(
        (resp:any)=>{
          this.requisicionesAprobadas = resp.requisiciones;
          this.totalElementos = resp.totalReqisiciones;
          this.paginarResultados();
          this.activarPaginaActual(pagina);
      },
        error => {
          swal(
            'Error al consultar las requisiciones',
            error.error.mensaje + ' | ' + error.error.errors.message,
            'error'
          );
        });
  }

  obtenerTodasLasCompras(pagina:number){
    let desde = (pagina -1)*10;

    this._comprasService.obtenerCompras(desde, false, true)
      .subscribe(
        (resp:any)=>{
          this.todasLasCompras = resp.compras;
          this.totalTodasLasCompras = resp.totalCompras;
          this.paginarResultadosTodasLasCompras();
          this.activarPaginaActualTodasLasCompras(pagina);
      },
      (error)=>{
        swal(
          'Error al consultar las compras',
          error.error.mensaje + ' | ' + error.error.errors.message,
          'error'
        );
      });
  }

  activarPaginaActualTodasLasCompras(paginaClickeada:number){
    this.paginasTodasLasCompras.forEach(pagina => {
      if (paginaClickeada === pagina.pagina) {
        pagina.active = true;
        this.paginaActualTodasLasCompras = pagina.pagina;
      } else {
        pagina.active = false;
      }
    });
  }

  paginarResultadosTodasLasCompras(){
    if (!this.totalTodasLasCompras) {
      return;
    }

    this.paginasTodasLasCompras = [];
    const numeroDePaginas = Math.ceil(this.totalTodasLasCompras / 10);
    let objetoPagina;

    for (let pagina = 1; pagina <= numeroDePaginas; pagina++) {
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginasTodasLasCompras.push(objetoPagina);

    }

    this.paginasTodasLasCompras[0].active = true;
  }

  obtenerCompras(pagina: number) {
    let desde = (pagina-1)*10;

    this._comprasService.obtenerCompras(desde,true)
      .subscribe(
        (resp:any)=>{
          
          this.compras=resp.compras;
          this.totalCompras = resp.totalCompras;
          this.paginarResultadosCompras();
          this.activarPaginaActualCompras(pagina);
          
        },
        (error)=>{
          swal(
            'Error al consultar las compras',
            error.error.mensaje + ' | ' + error.error.errors.message,
            'error'
          );
        });
  }

  cargarElementosPagina(pagina) {
    this.obtenerRequisicionesAprobadas(pagina);
    this.activarPaginaActual(pagina);
  }

  cargarElementosPaginaCompras(pagina) {
    this.obtenerCompras(pagina);
    this.activarPaginaActualCompras(pagina);
  }

  cargarElementosPaginaTodasLasCompras(pagina) {
    this.obtenerTodasLasCompras(pagina);
    this.activarPaginaActualTodasLasCompras(pagina);
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

  activarPaginaActualCompras(paginaClickeada) {
    this.paginasCompras.forEach(pagina => {
      if (paginaClickeada === pagina.pagina) {
        pagina.active = true;
        this.paginaActualCompras = pagina.pagina;
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

  paginaAnteriorCompras() {
    const paginaActual = this.paginasCompras.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    this.cargarElementosPaginaCompras(paginaActual.pagina - 1);
  }

  paginaAnteriorTodasLasCompras() {
    const paginaActual = this.paginasTodasLasCompras.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    this.cargarElementosPaginaTodasLasCompras(paginaActual.pagina - 1);
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

  paginaSiguienteCompras() {
    const paginaActual = this.paginasCompras.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina * 10 >= this.totalCompras) {
      return;
    }
    this.cargarElementosPaginaCompras(paginaActual.pagina + 1);
  }

  paginaSiguienteTodasLasCompras() {
    const paginaActual = this.paginasTodasLasCompras.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina * 10 >= this.totalTodasLasCompras) {
      return;
    }
    this.cargarElementosPaginaTodasLasCompras(paginaActual.pagina + 1);
  }

  paginarResultadosCompras(){
    if (!this.totalCompras) {
      return;
    }

    this.paginasCompras = [];
    const numeroDePaginas = Math.ceil(this.totalCompras / 10);
    let objetoPagina;

    for (let pagina = 1; pagina <= numeroDePaginas; pagina++) {
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginasCompras.push(objetoPagina);

    }

    this.paginasCompras[0].active = true;

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

  generarOrdenDeCompra(requisicion){
    this.requisicionesSeleccionadas=[];

    this.requisicionesAprobadas.forEach((requisicion)=>{
      if(requisicion.seleccionada){
        this.requisicionesSeleccionadas.push(requisicion);
      }
    });

    if(this.requisicionesSeleccionadas.length===0){
      return;
    }
    
    $('#modalOrdenDeCompra').modal('toggle');

  }

  mostrarDetalleCompra(compra){
    
    this.compra=compra;
    this.modalCompra.compra=this.compra;
    this.modalCompra.setearCompra(compra);
    $("#modalOrdenDeCompra").modal('toggle')
  }
}
