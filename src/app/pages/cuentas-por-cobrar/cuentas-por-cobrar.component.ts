import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/services/ventas/ventas.service';

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.css']
})
export class CuentasPorCobrarComponent implements OnInit {

  clienteActual:string;

  //Data
  clientesConSaldoPendiente: any[];
  ventasConSaldo:any[];

  constructor(
    private _ventasService: VentasService
  ) { }

  ngOnInit() {
    this._ventasService.obtenerListaDeClientesConSaldoPendiente().subscribe(
      (resp:any)=>{
        this.clientesConSaldoPendiente= resp.clientes;
      },
    );
  }

  cargarVentasConSaldoDelCliente(id, index){
    this._ventasService.obtenerVentasConSaldoPendienteDeUnCliente(id).subscribe(
      (resp:any)=>{
        this.ventasConSaldo = resp.ventasConSaldo;
        this.clienteActual = (resp.ventasConSaldo[0])?resp.ventasConSaldo[0].cliente.nombre:null;

        //Reseteamos la propiedad activo de todos los demas clientes
        this.clientesConSaldoPendiente.forEach(cliente=>{
          cliente.activo=false;
        });
        //Seteamos el cliente clickeado como cliente activo        
        this.clientesConSaldoPendiente[index].activo=true;
      }
    );
  }

}
