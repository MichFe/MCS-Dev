import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';

declare function toggleSidebar();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor( 
    public _sidebar:SidebarService,
    public _usuarioService:UsuarioService 
  ) { }
  
  ngOnInit() {
  }

  logout(){
    this._usuarioService.logout();
  }

  expandCollapsSidebar(){
    
    if (window.innerWidth <= 600 && window.innerHeight <= 800) {
    
    toggleSidebar();

    }
  }

}
