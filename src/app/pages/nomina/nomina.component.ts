import { Component, OnInit } from '@angular/core';
import { NominaService } from 'src/app/services/nomina/nomina.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { GastoService } from 'src/app/services/gasto/gasto.service';
declare var $:any;

@Component({
  selector: "app-nomina",
  templateUrl: "./nomina.component.html",
  styleUrls: ["./nomina.component.css"]
})
export class NominaComponent implements OnInit {

  //Variables
  fecha = new Date();
  fechaInicial = new Date();
  fechaFinal = new Date();
  nominaEmpleadoSeleccionado: any;
  indiceEmpleadoSeleccionado:any;
  totalNomina:number;

  //Data
  nomina: any;
  meses = [
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

  constructor(
    private _nominaService: NominaService,
    private _usuarioService: UsuarioService,
    private _gastoService: GastoService
  ) {}

  ngOnInit() {
    this.obtenerNominaFechaEnRango(this.fecha);
    // this.crearNuevaNomina(this.nomina);
  }

  eliminarNomina(){

    swal(
      'Eliminar',
      '¿Está seguro de que desea eliminar la nómina?',
      'warning', {
        buttons: {
          Aprobar: {
            text: 'Si, Aprobar',
            value: true,
            className: 'btn-warning'
          },
          Rechazar: {
            text: 'No, regresar',
            value: false,
            className: 'btn-danger'
          }
        },

      }).then(isConfirm => {
        if(isConfirm){
          this._nominaService.eliminarNomina(this.nomina._id).subscribe(
            (resp: any) => {
              this.obtenerNominaFechaEnRango(this.fecha);
              swal(
                "Nómina Eliminada",
                "La nómina se ha eliminado exitosamente",
                "success"
              );
            },
            (error) => {
              swal(
                "Error al eliminar nómina",
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            });
        }else{
          return;
        }
      });

    
  }

  pagarNomina(){
    let fechaInicial:Date = new Date(this.nomina.fechaInicial);
    let fechaFinal:Date = new Date(this.nomina.fechaFinal);


    let gasto = {
      fecha: new Date(),
      monto: this.nomina.total,
      descripcion: `Pago de nómina del ${ fechaInicial.getDate() } al ${ fechaFinal.getDate()} de ${ this.meses[fechaFinal.getMonth()] } del ${ fechaFinal.getFullYear() }`,
      categoria: 'Nómina',
      proveedor: null,
      pagoCompra: null,
      pagoNomina: this.nomina._id,
      gastoOperativo: true
    }

    this._gastoService.crearGasto(gasto).subscribe(
      (resp:any)=>{

        this.nomina.estatus = "Pagada";

        this._nominaService.actualizarNomina(this.nomina).subscribe(
          (resp)=>{
            swal(
              "Pago de nómina registrado",
              "El pago de la nómina ha sido registrado exitosamente en Gastos",
              "success"
            );
        },
        (error)=>{
          swal(
            "Error al actualizar estatus de nómina a pagada",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        })
        
    },
    (error)=>{
      swal(
        "Error al registrar gasto",
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });

  }

  nominaSemanaAnterior(){
    let fechaInicialSemanaAnterior = new Date(this.fechaInicial);
    fechaInicialSemanaAnterior.setDate(fechaInicialSemanaAnterior.getDate()-7);
    let fechaFinalSemanaAnterior = new Date(fechaInicialSemanaAnterior);
    fechaFinalSemanaAnterior.setDate(fechaFinalSemanaAnterior.getDate()+6);

    this.fechaInicial = fechaInicialSemanaAnterior;
    this.fechaFinal = fechaFinalSemanaAnterior;

    this.obtenerNominaFechaEnRango(fechaInicialSemanaAnterior);
  }

  nominaSemanaSiguiente(){
    let fechaInicialSemanaSiguiente = new Date(this.fechaInicial);
    fechaInicialSemanaSiguiente.setDate(fechaInicialSemanaSiguiente.getDate() + 7);
    let fechaFinalSemanaSiguiente = new Date(fechaInicialSemanaSiguiente);
    fechaFinalSemanaSiguiente.setDate(fechaFinalSemanaSiguiente.getDate() + 6);

    this.fechaInicial = fechaInicialSemanaSiguiente;
    this.fechaFinal = fechaFinalSemanaSiguiente;
    this.obtenerNominaFechaEnRango(fechaInicialSemanaSiguiente);
  }

  abrirModalAjustes(i) {
    if(this.nomina.estatus != "Por Pagar"){
      return;
    }

    this.indiceEmpleadoSeleccionado = i;
    this.nominaEmpleadoSeleccionado = this.nomina.nominaEmpleados[i];

    $("#modalAjusteNomina").modal("toggle");
  }

  actualizarNominaEmpleado(nominaEmpleado){
    
    this.nomina.nominaEmpleados[this.indiceEmpleadoSeleccionado] = nominaEmpleado;
    this.actualizarNomina();

  }

  calcularTotalNomina(){

    let nuevoTotalNomina=0;

    this.nomina.nominaEmpleados.forEach(nominaEmpleado => {
      nuevoTotalNomina += nominaEmpleado.salarioFinal;
    });
    
    this.nomina.total=nuevoTotalNomina;
  }

  

  cambiarEstatusDeAsistencia(i, dia) {
    let estatusActual = this.nomina.nominaEmpleados[i][dia];

    if (estatusActual == "Asistencia") {
      estatusActual = "Retardo";
      this.nomina.nominaEmpleados[i][dia] = estatusActual;
      return;
    }

    if (estatusActual == "Retardo") {
      estatusActual = "Falta";
      this.nomina.nominaEmpleados[i][dia] = estatusActual;
      return;
    }

    if (estatusActual == "Falta") {
      estatusActual = "Asistencia";
      this.nomina.nominaEmpleados[i][dia] = estatusActual;
      return;
    }
  }

  actualizarNomina() {
    this.calcularTotalNomina();
    this._nominaService.actualizarNomina(this.nomina).subscribe(
      (resp:any) => {

        this.nomina = resp.nomina;
        
        swal(
          "Nomina Actualizada",
          `La nomina del ${this.fechaInicial.getDate()} de ${
            this.meses[this.fechaInicial.getMonth()]
          } al ${this.fechaFinal.getDate()} de ${
            this.meses[this.fechaFinal.getMonth()]
          } del ${this.fechaFinal.getFullYear()} se ha actualizado correctamente`,
          "success"
        );
      },
      error => {
        swal(
          "Error al actualizar nómina",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  crearNuevaNomina(nomina: any) {
    this._nominaService.crearNomina(nomina).subscribe(
      (resp: any) => {
        this.nomina = resp.nomina;
      },
      error => {
        swal(
          "Error al crear nómina en blanco",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  obtenerNominaFechaEnRango(fecha) {
    
    this._nominaService.obtenerNominaFechaEnRango(fecha).subscribe(
      (resp: any) => {
        if (!resp.nomina.fechaInicial) {
          this.nomina = null;
          //this.prepararNuevaNomina(fecha);
        } else {
          this.nomina = resp.nomina;
          this.fechaInicial = new Date(resp.nomina.fechaInicial);
          this.fechaFinal = new Date(resp.nomina.fechaFinal);
        }
      },
      error => {
        this.nomina = null;
        //this.prepararNuevaNomina(fecha);
      }
    );
  }

  obtenerTodosLosUsuarios() {
    return new Promise((resolve, reject) => {
      this._usuarioService.obtenerTodosLosEmpleados().subscribe(
        (resp: any) => {
          resolve(resp.usuarios);
        },
        error => {
          swal(
            "Error al obtener usuarios",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );
    });
  }

  async prepararNuevaNomina(fecha) {

    let diaSemanaActual = this.fechaInicial.getDay();
    let diasInicioSemana;

    if( diaSemanaActual == 0 ){
      diasInicioSemana = 6  
    }else{
      diasInicioSemana = diaSemanaActual != 1 ? diaSemanaActual - 1 : 0;
    }
    
    
    let fechaInicial = new Date(this.fechaInicial);
    fechaInicial.setDate(fechaInicial.getDate()-diasInicioSemana);
    fechaInicial.setHours(0,0,0,0);

    let fechaFinal = new Date(this.fechaInicial);
    fechaFinal.setDate(fechaInicial.getDate() + 6);
    fechaFinal.setHours(0,0,0,0);

    this.fechaInicial = fechaInicial;
    this.fechaFinal = fechaFinal;

    let nominaEmpleadoEstandar = {
      empleado: null,
      lu: "Asistencia",
      ma: "Asistencia",
      mi: "Asistencia",
      ju: "Asistencia",
      vi: "Asistencia",
      sa: "Asistencia",
      do: "Asistencia",
      salarioBase: 0,
      ajustes: [],
      totalAjustes: 0,
      salarioFinal: 0
    };

    let usuarios:any = await this.obtenerTodosLosUsuarios();    

    usuarios = usuarios.filter( (usuario)=>{
      return usuario.blacklist !== true;
    });
    

    let nomina = {
      fechaInicial: fechaInicial,
      fechaFinal: fechaFinal,
      nominaEmpleados: [],
      total: 0
    };

    usuarios.forEach((usuario, index) => {
      let nominaEmpleado: any = {};
      Object.assign(nominaEmpleado, nominaEmpleadoEstandar);

      nominaEmpleado.empleado = usuario._id;
      nominaEmpleado.salarioBase = usuario.salario ? usuario.salario : 0;
      nominaEmpleado.salarioFinal = usuario.salario ? usuario.salario : 0;

      nomina.nominaEmpleados.push(nominaEmpleado);
      nomina.total += nominaEmpleado.salarioFinal;

      if (index >= usuarios.length - 1) {
        this.nomina = nomina;

        this.crearNuevaNomina(this.nomina);
      }
    });
  }
}
