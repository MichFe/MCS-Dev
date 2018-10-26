import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuarios/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert'

declare function init_plugins();


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  recordarPassword:boolean=false;
  email:string;

  constructor(
    private _usuarioService:UsuarioService,
    private router:Router,
  ) {}

  ngOnInit() {

    init_plugins();

    this.email = localStorage.getItem('email') || '';
    if( this.email.length > 1 ){
      this.recordarPassword = true;
    }
    
  }

  login(forma:NgForm){

    //Validando que la forma sea válida
    if( forma.invalid ){
      return
    }
    //---->

    //Construyendo el objeto usuario con los valores del formulario
    let usuario = new Usuario(null, forma.value.email, forma.value.password );
    //---->

    // Enviando los datos de acceso a través de nuestro servicio login y recibiendo
    // true o false dependiendo si el login fue exitoso o no
    this._usuarioService.login( usuario, forma.value.recordarPassword ).
          subscribe( (correcto)=>{
            
            if(correcto){
              this.router.navigate(['/dashboard']);
            }else{
              swal('Login', 'El usuario o la contraseña son incorrectos', 'warning');
            }
            
          });
    //---->
    

  }
}
