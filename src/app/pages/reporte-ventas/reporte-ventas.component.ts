import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/services/ventas/ventas.service';
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

  //Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];

  //Data
  ventas: any[];
  ventasAnuales: any = [2, 3, 4, 4, 3, 2];
  ventasMensuales: any = [1, 2, 5, 3];
  ventasSemanales: any = [5, 3, 1, 4];
  ventasDiarias: any = [3, 2, 5, 7];
  ventasPorCobrar: any = [80, 20];

  //functions
  actualizarAnchoDegraficas2 = function() {
    this.configurarGraficas();
  }.bind(this);

  constructor(private _ventasService: VentasService) {

    

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
      spotColor: ""
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
      spotColor: ""
    });

    $("#sparkWeek").sparkline(this.ventasSemanales, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#02e7a6",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#02e7a6",
      maxSpotColor: "",
      minSpotColor: "",
      spotColor: ""
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
      sliceColors: [
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
      ],
      offset: "180",
      borderColor: "#fff",
      // lineColor: "#fff",
      // fillColor: "#7460ee",
      // maxSpotColor: "#7460ee",
      // highlightLineColor: "rgba(0, 0, 0, 0.2)",
      // highlightSpotColor: "#7460ee",
      tooltipFormat: "{{offset:names}} ({{percent.1}}%)",
      tooltipValueLookups: {
        names: {
          0: "Enero",
          1: "Febrero",
          2: "Marzo",
          3: "Abril",
          4: "Mayo",
          5: "Junio"
          // Add more here
        }
      }
    });

    $("#sparkPieCredito").sparkline(this.ventasPorCobrar, {
      type: "pie",
      width: "200px",
      height: "200px",
      highlightLighten: 0.6,
      sliceColors: [
        "#00b894",
        "#ffeaa7",
        "#fdcb6e",
        "#55efc4",
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
      ],
      offset: "180",
      borderColor: "#fff",
      // lineColor: "#fff",
      // fillColor: "#7460ee",
      // maxSpotColor: "#7460ee",
      // highlightLineColor: "rgba(0, 0, 0, 0.2)",
      // highlightSpotColor: "#7460ee",
      tooltipFormat: "{{offset:names}} ({{percent.1}}%)",
      tooltipValueLookups: {
        names: {
          0: "Liquidadas",
          1: "Por cobrar"
          // Add more here
        }
      }
    });
  }
}
