import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit, OnDestroy {

  //Variables
  sparkResize:any;

  //Data
  ventasAnuales: any = [2, 3, 4, 4, 3, 2]; 
  ventasMensuales: any = [1, 2, 5, 3];
  ventasSemanales: any = [ 5, 3, 1, 4];
  ventasDiarias: any = [ 3, 2, 5, 7 ];

  ventasPie: any = [10, 5, 3];

  //functions
  actualizarAnchoDegraficas = function(){
    this.configurarGraficas();
  }.bind(this);

  constructor() { }

  ngOnInit() {

    // Evento para cambiar ancho de las gráficas cuando cambia el ancho de la ventana
    window.addEventListener("resize", this.actualizarAnchoDegraficas);

    // Carga inicial de gráficas
    this.configurarGraficas();
    
  }

  ngOnDestroy() {

    // Se elimina el evento cuando se destruye el componente
    window.removeEventListener("resize", this.actualizarAnchoDegraficas);
    
  }

  
  configurarGraficas(){  

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
      type: 'line',
      width: '100%',
      height: '50',
      lineColor: '#fff',
      fillColor: '#009efb',
      maxSpotColor: '#009efb',
      highlightLineColor: 'rgba(0, 0, 0, 0.2)',
      highlightSpotColor: '#009efb'
    });

    $("#spark3").sparkline(this.ventasSemanales, {
      type: 'line',
      width: '100%',
      height: '50',
      lineColor: '#fff',
      fillColor: '#02e7a6',
      maxSpotColor: '#02e7a6',
      highlightLineColor: 'rgba(0, 0, 0, 0.2)',
      highlightSpotColor: '#02e7a6'
    });

    $("#spark4").sparkline(this.ventasDiarias, {
      type: 'line',
      width: '100%',
      height: '50',
      lineColor: '#fff',
      fillColor: '#ffbc34',
      maxSpotColor: '#ffbc34',
      highlightLineColor: 'rgba(0, 0, 0, 0.2)',
      highlightSpotColor: '#ffbc34'
    });

    $("#sparkPie").sparkline(this.ventasAnuales, {
      type: "pie",
      width: "200px",
      height: "200px",
      sliceColors:[

      ],
      offset: '90',
      borderColor: '#fff',
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
