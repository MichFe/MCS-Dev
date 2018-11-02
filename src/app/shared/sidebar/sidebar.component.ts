import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { Usuario } from '../../models/usuario.model';

declare function toggleSidebar();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario:Usuario;

  constructor( 
    public _sidebar:SidebarService,
    public _usuarioService:UsuarioService 
  ) { }
  
  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  logout(){
    this._usuarioService.logout();
  }

  expandCollapsSidebar(){
    
    // if ( window.innerWidth <= 800 ) {
    
    toggleSidebar();

    // }


  }

}
