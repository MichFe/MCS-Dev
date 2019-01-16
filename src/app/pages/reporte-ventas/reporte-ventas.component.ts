import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/services/ventas/ventas.service';
import { Chart } from 'chart.js';

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


  //Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  //Data
  ventas: any[];
  ventasAnuales: number[];
  ventasMensuales: any = [];
  ventasDiarias:any =[];
  ventasPorCobrar: any = [];

  graphColors=[
    "#55efc4",
    "#00b894",
    "#ffeaa7",
    "#fdcb6e",
    "#81ecec",
    "#00cec9",
    "#fab1a0",
    "#e17055",
    "#74b9ff",
    "#0984e3",
    "#ff7675",
    "#d63031",
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

  constructor(private _ventasService: VentasService) {
    this.year = this.fechaActual.getFullYear();
    this.month = this.fechaActual.getMonth();

    this.obtenerVentasMensuales(this.year);
    this.obtenerVentasDiarias(this.year, this.month);
    this.obtenerSaldoPendienteYMontoPagado();

  }

  ngOnInit() {

    this._ventasService.obtenerVentas(0).subscribe((resp: any) => {

      this.ventas = resp.ventas;
      this.conteoVentas = resp.totalVentas;
      this.paginarResultados();
    });

    // Carga inicial de gráficas
    this.configurarGraficas();
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
        this.obtenerVentasMensuales(this.year);

        this.month=0;
        this.day=1;
        this.obtenerVentasDiarias(this.year,this.month);
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

  obtenerSaldoPendienteYMontoPagado(){
    this._ventasService.obtenerSaldoPendienteYMontoPagado().subscribe(
      (resp:any)=>{
        this.ventasPorCobrar = [ Number(resp.totalMontoPagado), resp.totalSaldoPendiente];
        
        this.configurarGraficas();
      }
    );
  }

  obtenerVentasMensuales(year:number){
    this._ventasService.obtenerVentasMensuales(year).subscribe(
      (resp:any)=>{
        this.ventasAnuales = resp.ventasMensuales;
        this.configurarGraficas();
        this.totalVentasAnuales = this.ventasAnuales.reduce((a,b)=>a+b,0);
        
      }
    );
  }

  obtenerVentasDiarias(year:number, month:number){
    this._ventasService.obtenerVentasDiarias(year,month).subscribe(
      (resp:any)=>{
        this.ventasMensuales = resp.ventasDiarias;
        this.configurarGraficas();
        
      }
    );
  }

  obtenerVentas(pagina: number) {
    let desde = (pagina*10)-10;

    this._ventasService.obtenerVentas(desde).subscribe(
      (resp: any) => {
      this.ventas = resp.ventas;
      this.activarPagina(pagina);

    });
  }

  //============================================================
  //Funciones de paginado
  //============================================================
  activarPagina(pagina:number){

    //Seteamos todas las paginas como inactivas
    this.paginas.forEach( pagina => {
      pagina.active=false;
    });

    this.paginas[pagina-1].active=true;
  }

  paginaAnterior() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }
    
    this.obtenerVentas(paginaActual.pagina - 1);
  }

  paginaSiguiente(){
    let paginaActual = this.paginas.find(pagina =>{
      return pagina.active;
    });

    if(paginaActual.pagina === this.paginas.length){
      return;
    }

    this.obtenerVentas( paginaActual.pagina + 1 );
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

    this.paginas[0].active = true;

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
      fillColor: "#7460ee",
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
      fillColor: "#009efb",
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

    let canvas1 = <HTMLCanvasElement> document.getElementById("chart-bar-ventasMensuales");
    let ctx1 = canvas1.getContext('2d');

    let chart1 = new Chart(ctx1,{
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
      options: {}
    });
  }
}
