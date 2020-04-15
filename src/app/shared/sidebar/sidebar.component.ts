import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RequisicionesService } from 'src/app/services/requisiciones/requisiciones.service';

declare function toggleSidebar();


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  usuario:Usuario;

  constructor( 
    public _sidebar:SidebarService,
    public _usuarioService:UsuarioService,
    public _requisicionesService: RequisicionesService 
  ) { 
    this.usuario = this._usuarioService.usuario;
    this._sidebar.obtenerMenuDeUsuario();
    
    if (this.usuario.role === "ADMIN_ROLE") {
      this.obtenerTotalRequisicionesPorAprobar(1);
    }
  }
  
  ngOnInit() {
    
  }

  obtenerTotalRequisicionesPorAprobar(pagina){
    this._sidebar.obtenerTotalRequisicionesPorAprobar();
  };

  logout(){
    this._usuarioService.logout();
  }

  expandCollapsSidebar(){
    
    // if ( window.innerWidth <= 800 ) {
    
    toggleSidebar();

    // }


  }

}
