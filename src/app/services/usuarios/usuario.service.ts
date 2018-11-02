import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';



@Injectable({
  providedIn: "root"
})
export class UsuarioService {
  usuario: Usuario;
  id: string;
  token: string;

  constructor(
    public http: HttpClient, 
    private router: Router,
    private _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  //------------------------
  // Función de login
  //------------------------
  login(usuario: Usuario, recordar: boolean = false) {
    //Guardamos o borramos el email del local storage, segun las preferencias del usuario
    if (recordar) {
      localStorage.setItem("email", usuario.email);
    } else {
      localStorage.removeItem("email");
    }
    // ---->

    //Construimos ruta del servicio
    let url = URL_SERVICIOS + "/login";
    // ---->

    // Realizamos petición de login al backend
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        // Guardamos los datos del usuario, su token e id
        this.guardarStorage(resp.id, resp.token, resp.usuario);

        return true;
        // ---->
      }),
      catchError(err => {
        return of(false);
      })
    );
    // FIN de Petición al backend
  }
  //------------------------
  // FIN de Función login
  //------------------------

  //---------------------------
  // Función de logout
  //---------------------------
  logout() {
    this.usuario = null;
    this.token = "";
    this.id = "";

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("usuario");

    this.router.navigate(["/login"]);
  }
  //---------------------------
  // Fin de Función de logout
  //---------------------------

  //-------------------------------------
  // Función crear Usuario
  //-------------------------------------
  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + "/usuario";

    return this.http.post(url, usuario);
  }
  //-------------------------------------
  // FIN de Función crear Usuario
  //-------------------------------------

  //-------------------------------
  // Función actualizar usuario
  //-------------------------------
  actualizarUsuario( usuario:Usuario ){
    let token=this.token;
    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + token;

    return this.http.put( url, usuario ).pipe( 
      map( (resp:any)=>{

        swal(
          'Actualización exitosa',
          'La información de usuario se ha actualizado correctamente',
          'success'
        );
        

        let usuarioDB:Usuario = resp.usuario;
        this.guardarStorage( usuarioDB._id, this.token, usuarioDB);
      
        return true;
      }),
      catchError( (err:any)=>{
        
        swal(
          'Error al actualizar usuario',
          err.error.mensaje + ' | ' + err.error.errors.message,
          'error'
        );

        return err;
      }));
  }
  //--------------------------------------
  // FIN de Función actualizar usuario
  //--------------------------------------

  //------------------------------------------------------------------
  // Función para guardar datos del usuario en localstorage
  //------------------------------------------------------------------
  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
    this.id = id;
  }
  //------------------------------------------------------------------
  // FIN de Función para guardar datos del usuario en localstorage
  //------------------------------------------------------------------

  cambiarImagen(file:File, id: string){

    this._subirArchivoService.subirArchivo( file, 'usuario', id )
        .then(
          (resp:any)=>{

            this.usuario.img = resp.usuario.img;
            swal(
              'Imagen actualizada',
              'Se ha actualizado la imagen de: ' + this.usuario.nombre,
              'success'
            );

            this.guardarStorage( id, this.token, this.usuario );
            
          }
        )
        .catch(
          (err)=>{
            console.log(err);
            
          });

  }

  //-------------------------------------------------------------------------
  // Función para cargar los datos del usuario desde el localstorage
  //-------------------------------------------------------------------------
  cargarStorage() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.id = localStorage.getItem("id");
    } else {
      this.token = "";
      this.usuario = null;
      this.id = "";
    }
  }
  //-------------------------------------------------------------------------
  // FIN de Función para cargar los datos del usuario desde el localstorage
  //-------------------------------------------------------------------------

  //--------------------------------------------------------------
  // Función para validar si el usuario esta logueado o no
  //--------------------------------------------------------------
  validarLogin() {
    let url = URL_SERVICIOS + "/validarToken";

    return this.http.post(url, {
      token: this.token
    });
  }
  //--------------------------------------------------------------
  // FIN Función para validar si el usuario esta logueado o no
  //--------------------------------------------------------------
}
