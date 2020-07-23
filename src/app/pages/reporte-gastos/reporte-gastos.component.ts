import { Component, OnInit } from '@angular/core';
import { GastoService } from 'src/app/services/gasto/gasto.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { Chart } from "chart.js";
import { VentasService } from 'src/app/services/ventas/ventas.service';
declare var $:any;

@Component({
  selector: "app-reporte-gastos",
  templateUrl: "./reporte-gastos.component.html",
  styleUrls: ["./reporte-gastos.component.css"]
})
export class ReporteGastosComponent implements OnInit {
  totalGastosAnuales: number;
  totalGastoOperativoAnual: number;
  totalGastoNetoAnual: number;
  totalVentasAnuales: number;
  categoriaActual: string = "0";
  gastoSeleccionadoTabla: any = {};

  //Variables de fechas
  fechaActual = new Date();
  year: number;
  month: number = 0;
  day: number = this.fechaActual.getDate();

  fechaInicial = new Date( 2020, 0, 0 );
  fechaFinal = new Date( 2020, 7, 31 );

  // Variables de Paginado
  paginas: any[] = [
    {
      pagina: 1,
      active: false
    }
  ];
  conteoGastos: number;
  paginaActual: number = 1;

  //Data
  gastos: any[] = [];
  gastosDiarios: any = [];
  gastosMensuales: any = [];
  gastosAnuales: number[] = [];
  cuentasPorPagar: any = [];
  ventasAnuales: any = [];
  gastosPorCategoria: any = [];
  objetosGastosPorCategoria: any = [];

  mesesArray = [
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
  listaGastos = [
    "Proveedores Productos",
    "Proveedores Materia Prima",
    "Proveedores Maquila",
    "Consumibles",
    "Nómina",
    "Otros",
    "Fletes",
    "Publicidad",
    "Gastos no Operativos",
    "Comisiones por Ventas",
    "Impuestos",
    "Transporte",
    "Maquinaria/Equipo",
    "Mantenimiento",
    "Servicios/Rentas"
  ];

  //Variables de gráficas
  sparkResize: any;

  canvas1: any;
  ctx1: any;
  chart1: any;

  canvas2: any;
  ctx2: any;
  chart2: any;

  graphColors = [
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

  constructor(
    private _gastosService: GastoService,
    private _usuarioService: UsuarioService,
    private _ventasService: VentasService
  ) {
    this.year = this.fechaActual.getFullYear();
    this.month = this.fechaActual.getMonth();
    this.categoriaActual = "0";

    this.obtenerGastosMensuales(this.year, this.categoriaActual);
    this.obtenerVentasMensuales(this.year);
    this.obtenerTotalDeGastoOperativo(this.year);
    this.obtenerTotalDeGastoAnual(this.year);
    this.obtenerGastosDiarios(this.year, this.month, this.categoriaActual);
    this.obtenerSaldoPendienteYMontoPagado(this.year, this.categoriaActual);
  }

  ngOnInit() {
    //Grafica de ventas mensuales
    this.canvas1 = <HTMLCanvasElement>(
      document.getElementById("chart-bar-gastosMensuales")
    );
    
    this.canvas2 = <HTMLCanvasElement>(
      document.getElementById("chart-bar-gastosPorCategoria")
    );

    this.ctx1 = this.canvas1.getContext("2d");
    this.ctx2 = this.canvas2.getContext("2d");

    this.obtenerGastos(1, this.categoriaActual);
    this.cargarGastosPorCategoriaMes();


    // Carga inicial de gráficas
    this.configurarGraficas();
  }

  cargarGastosPorCategoriaMes(){

    this.fechaInicial = new Date( this.year, this.month, 1 );
    this.fechaFinal = new Date( this.year, this.month + 1, 0 );

    this.obtenerGastosPorCategoria();
    
  }

  cargarGastosPorCategoriaAnual(){

    this.fechaInicial = new Date( this.year, 0, 1 );
    this.fechaFinal = new Date( this.year, 11, 31  );

    this.obtenerGastosPorCategoria();
  }

  obtenerGastosPorCategoria(){
    this._gastosService.obtenerTotalGastosPorCategoria( this.fechaInicial, this.fechaFinal ).subscribe( 
      ( resp:any ) => {
        this.objetosGastosPorCategoria = resp.gastosPorCategoria;

        this.gastosPorCategoria = [];

        // Definiendo dataset a 0 en cada categoría
        this.listaGastos.forEach( (categoria) => {
          this.gastosPorCategoria.push(0);
        });

        // Cargado la consulta al data set
        this.listaGastos.forEach( (categoria, indexListaGasto) => {
          this.objetosGastosPorCategoria.forEach( (categoriaObjectArray) =>{
            if(categoria == categoriaObjectArray._id){
              this.gastosPorCategoria[indexListaGasto] = categoriaObjectArray.gastoTotal;
            }
          });
        });
        
        this.configurarGraficas();        
        
      },
      error =>{
        swal(
          "Error al obtener total de gastos por categoría",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      });
  }

  actualizarData() {
    this.obtenerGastos(1, this.categoriaActual);
    this.obtenerGastosMensuales(this.year, this.categoriaActual);
    this.obtenerVentasMensuales(this.year);
    this.obtenerTotalDeGastoOperativo(this.year);
    this.obtenerTotalDeGastoAnual(this.year);
    this.obtenerGastosDiarios(this.year, this.month, this.categoriaActual);
    this.obtenerSaldoPendienteYMontoPagado(this.year, this.categoriaActual);
    this.obtenerGastosPorCategoria();
    this.cargarGastosPorCategoriaMes();
  }

  obtenerTotalDeGastoOperativo(year) {
    this._gastosService.obtenerTotalAnualDeGastoOperativo(year).subscribe(
      (resp: any) => {
        this.totalGastoOperativoAnual = resp.totalGastoOperativo;
      },
      error => {
        swal(
          "Error al obtener total de gasto",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerVentasMensuales(year: number, unidadDeNegocio: string = "0") {
    this._ventasService
      .obtenerVentasMensuales(year, unidadDeNegocio)
      .subscribe((resp: any) => {
        this.ventasAnuales = resp.ventasMensuales;
        this.configurarGraficas();
        this.totalVentasAnuales = this.ventasAnuales.reduce((a, b) => a + b, 0);
      });
  }

  obtenerTotalDeGastoAnual(year: number, categoria: string = "0") {
    this._gastosService.obtenerGastosMensuales(year, categoria).subscribe(
      (resp: any) => {
        this.totalGastoNetoAnual = resp.gastosMensuales.reduce(
          (a, b) => a + b,
          0
        );
      },
      error => {
        swal(
          "Error al obtener total de gasto anual",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerGastosMensuales(year: number, categoria: string = "0") {
    this._gastosService.obtenerGastosMensuales(year, categoria).subscribe(
      (resp: any) => {
        this.gastosAnuales = resp.gastosMensuales;
        this.configurarGraficas();
        this.totalGastosAnuales = this.gastosAnuales.reduce((a, b) => a + b, 0);
      },
      error => {
        swal(
          "Error al obtener gastos mensuales",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerGastosDiarios(year: number, month: number, categoria: string = "0") {
    this._gastosService.obtenerGastosDiarios(year, month, categoria).subscribe(
      (resp: any) => {
        this.gastosMensuales = resp.gastosDiarios;
        this.configurarGraficas();
      },
      error => {
        swal(
          "Error al obtener gastos diarios",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerSaldoPendienteYMontoPagado(year, categoria: string = "0") {
    this._gastosService
      .obtenerSaldoPendienteYMontoPagado(year, categoria)
      .subscribe(
        (resp: any) => {
          this.cuentasPorPagar = [
            Number(resp.totalMontoPagado),
            resp.totalSaldoPendiente
          ];
          this.configurarGraficas();
        },
        error => {
          swal(
            "Error al obtener total de saldo pendiente y monto pagado",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );
  }

  obtenerGastos(pagina, categoriaActual = "0") {
    let desde = (pagina - 1) * 10;

    if (this.categoriaActual == "Todas") {
      categoriaActual = "0";
    }

    this._gastosService
      .obtenerGastosParaTablaReporteGastos(
        desde,
        categoriaActual,
        this.year,
        this.month
      )
      .subscribe(
        (resp: any) => {
          this.gastos = resp.gastos;
          this.conteoGastos = resp.totalGastos;
          this.paginarResultados();
          this.activarPagina(pagina);
        },
        error => {
          swal(
            "Error al obtener gastos",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );
  }

  verDetalleDeGasto(gasto) {}

  // Funciones de fechas
  cambiarDia() {
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

  cambiarMes() {
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
        mes = Number(mes);
        this.month = mes - 1;
        this.day = 1;
        this.obtenerGastosDiarios(this.year, this.month);
        this.obtenerGastos(1, this.categoriaActual);
        this.actualizarData();
        this.configurarGraficas();
      })
      .catch();
  }

  changeYear() {
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

        this.year = Number(year);

        this.month = 0;
        this.day = 1;
        this.actualizarData();
        this.configurarGraficas();
      })
      .catch();
  }

  //Funciones de paginado
  activarPagina(pagina: number) {
    //Seteamos todas las paginas como inactivas
    this.paginas.forEach(pagina => {
      pagina.active = false;
    });

    if (!this.paginas[pagina - 1]) {
      return;
    }

    this.paginas[pagina - 1].active = true;
    this.paginaActual = this.paginas[pagina - 1].pagina;
  }

  paginaAnterior() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === 1) {
      return;
    }

    this.obtenerGastos(paginaActual.pagina - 1, this.categoriaActual);
  }

  paginaSiguiente() {
    let paginaActual = this.paginas.find(pagina => {
      return pagina.active;
    });

    if (paginaActual.pagina === this.paginas.length) {
      return;
    }

    this.obtenerGastos(paginaActual.pagina + 1, this.categoriaActual);
  }

  paginarResultados() {
    this.paginas = [];

    let numeroDePaginas = Math.ceil(this.conteoGastos / 10);
    let objetoPagina;

    for (let pagina = 1; pagina <= numeroDePaginas; pagina++) {
      objetoPagina = {
        pagina: pagina,
        active: false
      };

      this.paginas.push(objetoPagina);
    }

    this.paginas[0] ? (this.paginas[0].active = true) : null;
  }

  //Funciones de gráficas
  actualizarAnchoDegraficas() {
    this.configurarGraficas();
  }

  configurarGraficas() {
    //Configuración de las gráficas
    $("#sparkYear").sparkline(this.gastosAnuales, {
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

    $("#sparkMonth").sparkline(this.gastosMensuales, {
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

    $("#sparkDay").sparkline(this.gastosDiarios, {
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

    $("#sparkPieGastos").sparkline(this.gastosAnuales, {
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

    $("#sparkPieCredito").sparkline(this.cuentasPorPagar, {
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
          1: "Por pagar"
          // Add more here
        }
      }
    });

    //Grafica de barras de ventas mensuales
    this.chart1 ? this.chart1.destroy() : null;
    this.chart1 = new Chart(this.ctx1, {
      type: "bar",
      data: {
        labels: this.mesesArray,
        datasets: [
          {
            label: "Gastos " + this.year,
            backgroundColor: this.graphColors,
            borderColor: this.graphColors,
            data: this.gastosAnuales
          }
        ]
      },

      // Configuration options go here
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var index = tooltipItem.index;
              var lecturaData = data.datasets[tooltipItem.datasetIndex];
              let monto: number = data.datasets[0].data[index];

              return (
                "  $" + monto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
        }
      }
    });

    this.chart2 ? this.chart2.destroy() : null;
    this.chart2 = new Chart(this.ctx2, {
      type: "horizontalBar",
      data: {
        labels: this.listaGastos,
        datasets: [
          {
            label: "Gastos por Categoría",
            backgroundColor: this.graphColors,
            borderColor: this.graphColors,
            data: this.gastosPorCategoria
          }
        ]
      },

      // Configuration options go here
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var index = tooltipItem.index;
              var lecturaData = data.datasets[tooltipItem.datasetIndex];
              let monto: number = data.datasets[0].data[index];

              return (
                "  $" + monto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
        }
      }
    });

  }
}
