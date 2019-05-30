import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuarios/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert'
import { MenuServiceService } from '../services/menuService/menu-service.service';

declare function init_plugins();

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  recordarPassword: boolean = false;
  email: string;

  movil: boolean = false;

  constructor(
    private _usuarioService: UsuarioService,
    private router: Router,
    private _menuService: MenuServiceService
  ) {
  }



  ngOnInit() {
    init_plugins();

    this.email = localStorage.getItem("email") || "";
    if (this.email.length > 1) {
      this.recordarPassword = true;
    }

    this.validarMovil();
  }

  validarMovil() {
    
    if (window.innerWidth <= 600 && window.innerHeight <= 850) {
      this.movil = true;
      
    } else {
      this.movil = false;
      
    }
  }

  login(forma: NgForm) {
    //Validando que la forma sea válida
    if (forma.invalid) {
      return;
    }
    //---->

    //Construyendo el objeto usuario con los valores del formulario
    let usuario = new Usuario(null, forma.value.email, forma.value.password, null);
    //---->

    // Enviando los datos de acceso a través de nuestro servicio login y recibiendo
    // true o false dependiendo si el login fue exitoso o no
    this._usuarioService
      .login(usuario, forma.value.recordarPassword)
      .subscribe(correcto => {
        
        if (correcto) {
          this._menuService.obtenerMenuDeUsuario(this._usuarioService.id).subscribe(
            (resp:any)=>{
              let menu = resp.menu.menu;
              this._menuService.menuDelUsuario = menu;

              let rutaInicial;
              if(menu[0].submenu && menu[0].submenu.length>0){
                rutaInicial = menu[0].submenu[0].url;
              }else{
                rutaInicial = menu[0].url;
              }
              this.router.navigate([rutaInicial]);
          },
          (error)=>{
            this._menuService.crearMenuDefault(this._usuarioService.id).subscribe(
              (resp:any)=>{
                let menu = resp.menu.menu;
                this._menuService.menuDelUsuario = menu;

                let rutaInicial;

                if (menu[0].submenu && menu[0].submenu.length > 0) {
                  rutaInicial = menu[0].submenu[0].url;
                } else {
                  rutaInicial = menu[0].url;
                }
                this.router.navigate([rutaInicial]);
              });
          });

        } else {
          swal(
            "Error en Login:",
            "El usuario o la contraseña son incorrectos",
            "warning"
          );
        }
      });
    //---->
  }
}
