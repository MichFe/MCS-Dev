import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Observable, Subject } from 'rxjs';
import { DeleteImageService } from '../deleteImage/delete-image.service';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  productos:any[]=[];
  carrito:any[]=[];
  cotizaciones:any[]=[];

  calcularTotalCotizacion:Observable<any>;
  calcularTotalCotizacionSubject:Subject<any>;

  constructor(
    private http:HttpClient,
    private _usuarioService:UsuarioService,
    private _deleteImageService: DeleteImageService
  ) { 
    this.calcularTotalCotizacionSubject = new Subject<any>();
    this.calcularTotalCotizacion = this.calcularTotalCotizacionSubject.asObservable();
  }

  actualizarCotizaciones(cotizacionesNuevas:any[]){
    //Limpiamos el arreglo cotizaciones
    this.cotizaciones.splice(0,this.cotizaciones.length);

    cotizacionesNuevas.forEach(cotizacion=>{
      this.cotizaciones.push(cotizacion);
    });
    
  }

  agregarProductosACotizacion(productosArray:any[]){

    productosArray.forEach((producto)=>{
      this.productos.push(producto);
    });

    this.calcularTotalCotizacionSubject.next();

  }

  eliminarProductoDeCotizacion(index){
        
        this.productos.splice(index, 1);            

  }

  vaciarCarrito(){
    this.carrito.splice(0,this.carrito.length);
    
  }

  vaciarProductosDeCotizacion(){
    this.productos.splice(0, this.productos.length);
    
  }

  actualizarCotizacion(cotizacion){    
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cotizacion/${cotizacion._id}?token=${token}`;

    
    return this.http.put(url, cotizacion);
  }

  guardarCotizacion(cotizacion){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cotizacion?token=${token}`;

    return this.http.post(url, cotizacion);
  }

  obtenerCotizacion( proyectoId ){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cotizacion/cotizacionProyecto/${proyectoId}?token=${token}`;
    
    return this.http.get(url);
  }

  eliminarCotizacion( cotizacionId ){
    let token = this._usuarioService.token;
    let url = URL_SERVICIOS + `/cotizacion/${ cotizacionId }?token=${token}`;

    return this.http.delete(url);
  }


}
