import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: "app-reporte-ventas",
  templateUrl: "./reporte-ventas.component.html",
  styleUrls: ["./reporte-ventas.component.css"]
})
export class ReporteVentasComponent implements OnInit {
  //Variables
  sparkResize: any;

  //Data
  ventasAnuales: any = [2, 3, 4, 4, 3, 2];
  ventasMensuales: any = [1, 2, 5, 3];
  ventasSemanales: any = [5, 3, 1, 4];
  ventasDiarias: any = [3, 2, 5, 7];

  ventasPie: any = [10, 5, 3];

  //functions
  actualizarAnchoDegraficas2 = function() {
    this.configurarGraficas();
  }.bind(this);

  constructor() {}

  ngOnInit() {
    // Carga inicial de gráficas
    this.configurarGraficas();
  }


  actualizarAnchoDegraficas(){
    this.configurarGraficas();
  }

  configurarGraficas() {
    //Configuración de las gráficas
    $("#spark1").sparkline(this.ventasAnuales, {
      type: "line",
      width: "100%",
      height: "50px",
      lineColor: "#fff",
      fillColor: "#7460ee",
      maxSpotColor: "#7460ee",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#7460ee"
    });

    $("#spark2").sparkline(this.ventasMensuales, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#009efb",
      maxSpotColor: "#009efb",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#009efb"
    });

    $("#spark3").sparkline(this.ventasSemanales, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#02e7a6",
      maxSpotColor: "#02e7a6",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#02e7a6"
    });

    $("#spark4").sparkline(this.ventasDiarias, {
      type: "line",
      width: "100%",
      height: "50",
      lineColor: "#fff",
      fillColor: "#ffbc34",
      maxSpotColor: "#ffbc34",
      highlightLineColor: "rgba(0, 0, 0, 0.2)",
      highlightSpotColor: "#ffbc34"
    });

    $("#sparkPie").sparkline(this.ventasAnuales, {
      type: "pie",
      width: "200px",
      height: "200px",
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
  }
}
