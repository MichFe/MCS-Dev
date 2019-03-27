import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/services/ventas/ventas.service';
import { Chart } from 'chart.js';
import { ClienteService } from 'src/app/services/clientes/cliente.service';
import { SubirArchivoService } from 'src/app/services/subirArchivo/subir-archivo.service';
import { MetasService } from 'src/app/services/metas/metas.service';
import swal from 'sweetalert';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

declare var $: any;

@Component({
  selector: "app-reporte-ventas",
  templateUrl: "./reporte-ventas.component.html",
  styleUrls: ["./reporte-ventas.component.css"]
})
export class ReporteVentasComponent implements OnInit {
  //Variables
  sparkResize: any;
  conteoVentas:number;
  fechaActual= new Date();
  year:number;
  month:number = 0;
  day:number = this.fechaActual.getDate();
  totalVentasAnuales:number;
  totalDescuentosAnuales:number;
  imagenClienteNuevo: File;
  ventaSeleccionadaTabla:any={};
  paginaActual:number=1;
  unidadDeNegocioActual:string='0';


  //Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  //Data
  ventas: any[]=[];
  ventasAnuales: number[]=[];
  ventasMensuales: any = [];
  ventasDiarias:any =[];
  ventasPorCobrar: any = [];
  metasMensuales:any[]=[];
  metasActuales:any;
  metaAnual:number;
  descuentosAnuales: number[]=[];

  //chartjs
  canvas1:any;
  ctx1:any;
  chart1:any;

  //chartjs descuentos mensuales
  canvas2:any;
  ctxt2:any;
  chart2:any;

  graphColors=[
    "#0a3d62", //Ene
    "#b71540", //Feb
    "#e58e26", //Mar
    "#006266", //Abr
    "#e55039", //May
    "#aaa69d", //Jun
    "#FFC312", //Jul
    "#6F1E51", //Ago
    "#273c75", //Sep
    "#f368e0", //Oct
    "#009432", //Nov
    "#d63031", //Dic
    "#a29bfe",
    "#6c5ce7",
    "#fd79a8",
    "#e84393",
    "#dfe6e9",
    "#b2bec3",
    "#636e72",
    "#2d3436"
  ];

  mesesArray =[
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  meses = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre"
  };

  constructor(
    private _ventasService: VentasService,
    private _clienteService: ClienteService,
    private _subirArchivoService:SubirArchivoService,
    private _metasService:MetasService,
    private _usuarioService: UsuarioService
    ) {

    this.year = this.fechaActual.getFullYear();
    this.month = this.fechaActual.getMonth();
    this.unidadDeNegocioActual=this._usuarioService.usuario.unidadDeNegocio;

    this.obtenerVentasMensuales(this.year, this.unidadDeNegocioActual);
    this.obtenerVentasDiarias(this.year, this.month, this.unidadDeNegocioActual);
    this.obtenerSaldoPendienteYMontoPagado(this.year,this.unidadDeNegocioActual);
    this.obtenerDescuentosMensuales(this.year, this.unidadDeNegocioActual);
    this.obtenerMetas();
    

  }

  actualizarData(){
    this.obtenerVentas(1,this.unidadDeNegocioActual);
    this.obtenerVentasMensuales(this.year, this.unidadDeNegocioActual);
    this.obtenerVentasDiarias(this.year, this.month, this.unidadDeNegocioActual);
    this.obtenerSaldoPendienteYMontoPagado(this.year,this.unidadDeNegocioActual);
    this.obtenerDescuentosMensuales(this.year, this.unidadDeNegocioActual);
    this.obtenerMetas();
    

  }

  ngOnInit() {
    //Grafica de ventas mensuales
    this.canvas1 = <HTMLCanvasElement>document.getElementById("chart-bar-ventasMensuales");
    this.ctx1 = this.canvas1.getContext('2d');

    //grafica de descuentos mensuales
    this.canvas2 = <HTMLCanvasElement>document.getElementById("chart-bar-descuentosMensuales");
    this.ctxt2 = this.canvas2.getContext('2d');

    this._ventasService.obtenerVentas(0, this.unidadDeNegocioActual,this.year, this.month).subscribe((resp: any) => {

      this.ventas = resp.ventas;
      this.conteoVentas = resp.totalVentas;
      this.paginarResultados();
    });

    // Carga inicial de gráficas
    this.configurarGraficas();
  }

  obtenerMetas(){    
    
    this._metasService.obtenerMeta(this.year, this.unidadDeNegocioActual)
      .subscribe(
        (resp:any)=>{
          this.metaAnual=0;
          
          this.metasActuales=resp.metas[0];
          this.metasMensuales=resp.metas[0].metas;

          this.metasMensuales.forEach(meta=>{
            this.metaAnual+=meta;
          })
      },
        (error) => {

          this.crearNuevasMetas();

          // swal(
          //   `Error al obtener metas del año: ${ this.year }`,
          //   error.error.mensaje + " | " + error.error.errors.message,
          //   "error"
          // );

        });

  }

  crearNuevasMetas(){

    if(this.unidadDeNegocioActual=='Todas'){
      return;
    }

    let meta = {
      year: this.year,
      unidadDeNegocio: this.unidadDeNegocioActual,
      metas: []
    };

    for (let mes = 0; mes < 12; mes++) {
      
      meta.metas[mes]=150000;
      
    };

    this._metasService.crearMeta(meta)
      .subscribe(
        (resp)=>{
          this.obtenerMetas();
          swal(
            'Creación de Metas',
            'Se han creado las metas por defecto para el año: ' + this.year,
            'success'
            );
      },
        (error) => {
          swal(
            `Error al crear metas por defecto para el año: ${this.year}`,
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        });


  }

  cambiarMeta(mes){

    swal({
      content: {
        element: "input"
      },
      text: "Ingresa una nueva meta para " + this.mesesArray[mes],
      buttons: [true, "Aceptar"]
    })
      .then(meta => {
        if (!meta) {
          return;
        }
        meta = Number(meta);
        let nuevasMetas= this.metasActuales;

        nuevasMetas.metas[mes]=meta;

        this._metasService.actualizarMeta(this.metasActuales._id, nuevasMetas)
          .subscribe(
            (resp)=>{
              this.obtenerMetas();
              swal(
                'Meta Actualizada',
                'Meta actualizada exitosamente',
                'success'
              );
          },
            (error) => {
              swal(
                `Error al actualizar meta`,
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            });

      })
      .catch();
  }

  changeYear(){
    swal({
      content: {
        element: "input"
      },
      text: "Ingresa un año",
      buttons: [true, "Aceptar"]
    })
      .then(year => {
        if (!year) {
          return;
        }
        
        this.year=Number(year);
        
        this.month=0;
        this.day=1;
        this.actualizarData();
        this.configurarGraficas();

      })
      .catch();
  }

  cambiarMes(){
    swal({
      content: {
        element: "input"
      },
      text: "Ingresa un mes [1-12]",
      buttons: [true, "Aceptar"]
    })
      .then(mes => {
        if (!mes) {
          return;
        }
        mes=Number(mes);
        this.month = mes-1;
        this.day = 1;
        this.obtenerVentasDiarias(this.year,this.month);
        this.obtenerVentas(1,this.unidadDeNegocioActual);
        this.configurarGraficas();

      })
      .catch();
  }

  cambiarDia(){
    swal({
      content: {
        element: "input"
      },
      text: "Ingresa un día [1-31]",
      buttons: [true, "Aceptar"]
    })
      .then(dia => {
        if (!dia) {
          return;
        }
        dia = Number(dia);
        this.day = dia;
      })
      .catch();
  }

  obtenerSaldoPendienteYMontoPagado(year,unidadDeNegocio:string='0'){

    (this.unidadDeNegocioActual == 'Todas') ? unidadDeNegocio = '0' : null;

    this._ventasService.obtenerSaldoPendienteYMontoPagado(year,unidadDeNegocio).subscribe(
      (resp:any)=>{
        this.ventasPorCobrar = [ Number(resp.totalMontoPagado), resp.totalSaldoPendiente];
        
        this.configurarGraficas();
      }
    );
  }

  obtenerVentasMensuales(year:number, unidadDeNegocio:string='0'){

    if(this.unidadDeNegocioActual=='Todas'){

      unidadDeNegocio='0';
      
    }
    
    this._ventasService.obtenerVentasMensuales(year, unidadDeNegocio).subscribe(
      (resp:any)=>{
        this.ventasAnuales = resp.ventasMensuales;
        this.configurarGraficas();
        this.totalVentasAnuales = this.ventasAnuales.reduce((a,b)=>a+b,0);
        
      }
    );
  }

  obtenerDescuentosMensuales(year:number, unidadDeNegocio:string='0'){
    if (this.unidadDeNegocioActual == 'Todas') {

      unidadDeNegocio = '0';

    }

    this._ventasService.obtenerDescuentosMensuales(year,unidadDeNegocio).subscribe(
      (resp:any)=>{
        this.descuentosAnuales = resp.descuentosMensuales;
        this.configurarGraficas();
        this.totalDescuentosAnuales = this.descuentosAnuales.reduce((a, b) => a + b, 0);
      });
  }

  obtenerVentasDiarias(year:number, month:number, unidadDeNegocio:string='0'){

    (this.unidadDeNegocioActual=='Todas')?unidadDeNegocio='0':null;

    this._ventasService.obtenerVentasDiarias(year,month,unidadDeNegocio).subscribe(
      (resp:any)=>{
        this.ventasMensuales = resp.ventasDiarias;
        this.configurarGraficas();
        
      }
    );
  }

  obtenerVentas(pagina: number, unidadDeNegocio:string='0') {
    
    if(this.unidadDeNegocioActual=='Todas'){
      unidadDeNegocio='0';
    }
    let desde = (pagina*10)-10;

    this._ventasService.obtenerVentas(desde, unidadDeNegocio,this.year, this.month).subscribe(
      (resp: any) => {
      this.ventas = resp.ventas;
      this.conteoVentas = resp.totalVentas;
      this.paginarResultados();
      this.activarPagina(pagina);

    });
  }

  resetearVenta(venta){

    this.ventaSeleccionadaTabla=venta;
  }

  verDetalleDeVenta(venta){
    this.ventaSeleccionadaTabla=venta;
    $('#modalDetalleVenta').modal('toggle');
  }

  registrarClienteNuevo(nuevoCliente) {
    this._clienteService.guardarCliente(nuevoCliente).subscribe(
      (resp: any) => {
        let cliente = resp.cliente;

        if (this.imagenClienteNuevo) {

          this._subirArchivoService
            .subirArchivo(this.imagenClienteNuevo, "cliente", cliente._id)
            .then(resp => {
              // console.log(resp);
            });

        }


        swal(
          "Registro exitoso",
          "El cliente " +
          resp.cliente.nombre +
          " se ha guardado correctamente!",
          "success"
        );
      },
      error => {
        swal(
          "Registro de cliente fallido",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  imagenNuevoCliente(file) {
    this.imagenClienteNuevo = file;
  }

  //============================================================
  //Funciones de paginado
  //============================================================
  activarPagina(pagina:number){
    
    //Seteamos todas las paginas como inactivas
    this.paginas.forEach( pagina => {
      pagina.active=false;
    });

    if (!this.paginas[pagina-1]) {
      return;
    }

    this.paginas[pagina-1].active=true;
    this.paginaActual=this.paginas[pagina-1].pagina;
  }

  paginaAnterior() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    
    this.obtenerVentas(paginaActual.pagina - 1,this.unidadDeNegocioActual);
  }

  paginaSiguiente(){
    let paginaActual = this.paginas.find(pagina =>{
      return pagina.active;
    });

    if(paginaActual.pagina === this.paginas.length){
      return;
    }

    this.obtenerVentas( paginaActual.pagina + 1,this.unidadDeNegocioActual );
  }

  paginarResultados(){

    this.paginas = [];

    let numeroDePaginas = Math.ceil(this.conteoVentas/10);
    let objetoPagina;

    for( let pagina=1; pagina <= numeroDePaginas; pagina++ ){
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginas.push(objetoPagina);
    }

    (this.paginas[0])?this.paginas[0].active = true:null;

  }
  //============================================================
  //FIN de Funciones de paginado
  //============================================================

  actualizarAnchoDegraficas() {
    this.configurarGraficas();
  }

  configurarGraficas() {
    //Configuración de las gráficas
    $("#sparkYear").sparkline(this.ventasAnuales, {
      type: "line",
      width: "100%",
      height: "50px",
      lineColor: "#fff",
      fillColor: "#b71540",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#7460ee",
      minSpotColor: "",
      maxSpotColor: "",
      spotColor: "",
      tooltipFormat: "{{offset:names}}: ${{y}}",
      tooltipValueLookups: {
        names: this.meses
        }
      });

    $("#sparkMonth").sparkline(this.ventasMensuales, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#0a3d62",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#009efb",
      maxSpotColor: "",
      minSpotColor: "",
      spotColor: "",
      tooltipFormat: "Dia {{x}}: ${{y}}"
    });

    $("#sparkDay").sparkline(this.ventasDiarias, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#ffbc34",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#ffbc34",
      maxSpotColor: "",
      minSpotColor: "",
      spotColor: ""
    });

    $("#sparkPieSales").sparkline(this.ventasAnuales, {
      type: "pie",
      width: "200px",
      height: "200px",
      highlightLighten: 0.6,
      sliceColors: this.graphColors,
      offset: "180",
      borderColor: "#fff",
      // lineColor: "#fff",
      // fillColor: "#7460ee",
      // maxSpotColor: "#7460ee",
      // highlightLineColor: "rgba(0, 0, 0, 0.2)",
      // highlightSpotColor: "#7460ee",
      tooltipFormat: "{{offset:names}} ${{value}} ({{percent.1}}%)",
      tooltipValueLookups: {
        names: this.meses
      }
    });

    // $("#sparkPieDescuentos").sparkline(this.descuentosAnuales, {
    //   type: "pie",
    //   width: "200px",
    //   height: "200px",
    //   highlightLighten: 0.6,
    //   sliceColors: this.graphColors,
    //   offset: "180",
    //   borderColor: "#fff",
    //   // lineColor: "#fff",
    //   // fillColor: "#7460ee",
    //   // maxSpotColor: "#7460ee",
    //   // highlightLineColor: "rgba(0, 0, 0, 0.2)",
    //   // highlightSpotColor: "#7460ee",
    //   tooltipFormat: "{{offset:names}} ${{value}} ({{percent.1}}%)",
    //   tooltipValueLookups: {
    //     names: this.meses
    //   }
    // });

    $("#sparkPieCredito").sparkline(this.ventasPorCobrar, {
      type: "pie",
      width: "200px",
      height: "200px",
      highlightLighten: 0.6,
      sliceColors: this.graphColors,
      offset: "180",
      borderColor: "#fff",
      // lineColor: "#fff",
      // fillColor: "#7460ee",
      // maxSpotColor: "#7460ee",
      // highlightLineColor: "rgba(0, 0, 0, 0.2)",
      // highlightSpotColor: "#7460ee",
      tooltipFormat: "{{offset:names}}: ${{value}} ({{percent.1}}%)",
      tooltipValueLookups: {
        names: {
          0: "Liquidadas",
          1: "Por cobrar"
          // Add more here
        }
      }
    });

    //Grafica de barras de ventas mensuales
    (this.chart1)?this.chart1.destroy():null;
    this.chart1 = new Chart(this.ctx1,{
      type: 'bar',
      data: {
        labels: this.mesesArray,
        datasets: [{
          label: "Ventas " + this.year,
          backgroundColor: this.graphColors,
          borderColor: this.graphColors,
          data: this.ventasAnuales,
        }]
      },

      // Configuration options go here
      options: {
        tooltips:{
          callbacks:{
            label: function(tooltipItem, data){
              var index=tooltipItem.index;
              var lecturaData=data.datasets[tooltipItem.datasetIndex];
              let monto:number = data.datasets[0].data[index];

              return '  $' + monto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              
            }
          }
        }
      }
    });

    //Grafica de descuentos mensuales
    (this.chart2) ? this.chart2.destroy() : null;
    this.chart2 = new Chart(this.ctxt2, {
      type: 'bar',
      data: {
        labels: this.mesesArray,
        datasets: [{
          label: "Descuentos " + this.year,
          backgroundColor: this.graphColors,
          borderColor: this.graphColors,
          data: this.descuentosAnuales,
        }]
      },

      // Configuration options go here
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var index = tooltipItem.index;
              var lecturaData = data.datasets[tooltipItem.datasetIndex];
              let monto: number = data.datasets[0].data[index];

              return '  $' + monto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            }
          }
        }
      }
    });


  }
}
