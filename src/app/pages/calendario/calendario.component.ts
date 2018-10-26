import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-calendario",
  templateUrl: "./calendario.component.html",
  styleUrls: ["./calendario.component.css"]
})
export class CalendarioComponent implements OnInit {
  fechaActual: Date = new Date();
  today: Date = new Date();

  year: number;
  month: number;

  calendario: any[];

  semana: any[] = [];
  semanas: any[] = [];

  dias: String[] = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  eventBackgroundColors: string[] = ["#278395", "#0300c4", "#ee7f00"];

  evento: string = "";
  diaEvento: number;
  semanaEvento: number;

  constructor() {
    this.year = this.fechaActual.getFullYear();
    this.month = this.fechaActual.getMonth();

    this.construirSemanas();
  }

  ngOnInit() {}

  nombreEvento(evento) {
    this.evento = evento.nombreEvento;

    let posicionEvento: number = this.semanas[this.semanaEvento][this.diaEvento]
      .eventos.length;

    let color = this.calcularColorDeEvento(posicionEvento + 1);

    let objetoEvento = {
      nombreEvento: this.evento,
      colorFondo: color
    };

    this.semanas[this.semanaEvento][this.diaEvento].eventos.push(objetoEvento);
  }

  calcularColorDeEvento(indiceEvento) {
    let modulo: number = indiceEvento % 3;
    let colorIndex: number;
    let color: string;

    //Paso la posicion del evento tal cual para los 3 primeros y
    //aplicamos el modulo para la posición 4 en adelante
    if (indiceEvento < 3) {
      colorIndex = indiceEvento;
    } else {
      modulo == 0 ? (colorIndex = 3) : (colorIndex = modulo);
    }

    //Guardo el color de mi arreglo de acuerdo a la posición correspondiente (0,1,2)
    color = this.eventBackgroundColors[colorIndex - 1];

    return color;
  }

  registrarSemanaYDia(semana, dia) {
    this.semanaEvento = semana;
    this.diaEvento = dia;
  }

  editarEvento(semana, dia, numEvento, evento: Event) {
    
    this.semanas[semana][dia].eventos[numEvento].nombreEvento = "Otro Evento";

    evento.stopPropagation();
  }

  mesAnterior() {
    if (this.month > 0) {
      this.month -= 1;
    } else {
      this.month = 11;
      this.year -= 1;
    }

    this.construirSemanas();
  }

  mesSiguiente() {
    if (this.month < 11) {
      this.month += 1;
    } else {
      this.month = 0;
      this.year += 1;
    }

    this.construirSemanas();
  }

  construirSemanas() {
    //Limpiamos el arreglo de semanas
    this.semanas = [];
    this.semana = [];

    //Definimos el año y mes en curso

    let year = this.year;
    let mes = this.month;

    //Inicializamos la fecha actual en el último día del mes anterior al mes en curso
    this.fechaActual = new Date(year, mes, 0);

    //Seteando el dia inicial para coincidir con el lunes de la semana 1
    let diaSemana = this.fechaActual.getDay();

    if (diaSemana != 7) {
      let diaFinal = this.fechaActual.getDate();
      let diasAdicionales = diaSemana;
      this.fechaActual.setDate(diaFinal - diasAdicionales);
    }

    //El primer ciclo itera a traves de semanas y el segundo llena los dias de la semana
    for (let semana = 1; semana <= 6; semana++) {
      let diaInicialSemana = this.fechaActual.getDay();

      for (let dia = diaInicialSemana; dia < 7; dia++) {
        let diaMes = this.fechaActual.getDate();
        let otroMes = false;
        let chequeoMes = this.fechaActual.getMonth();
        let chequeoToday: boolean;

        if (chequeoMes != this.month) {
          otroMes = true;
        } else {
          otroMes = false;
        }

        if (
          this.today.getDate() == diaMes &&
          this.today.getMonth() == chequeoMes &&
          this.today.getFullYear() == this.fechaActual.getFullYear()
        ) {
          chequeoToday = true;
        } else {
          chequeoToday = false;
        }

        this.semana[dia] = {
          numero: diaMes,
          eventos: [],
          otroMes: otroMes,
          today: chequeoToday
        };

        this.fechaActual.setDate(diaMes + 1);
      }

      this.semanas.push(this.semana);
      this.semana = [];
    }
  }
}
