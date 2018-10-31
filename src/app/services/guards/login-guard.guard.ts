import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioService } from '../usuarios/usuario.service';
import { map, catchError, switchAll } from 'rxjs/operators';
import swal from "sweetalert";

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(
    private _usuarioService:UsuarioService,
    private router:Router
  ){  }



  canActivate():Observable<boolean>{

    return this._usuarioService.validarLogin().pipe(
      map( (resp:any)=>{

      if(resp.ok){
      
        return true;

      }
      
    }),catchError((err)=>{
      this.router.navigate(['/login']);
        // swal( err.error.mensaje + ':', 'Aún no ha iniciado sesión o su sesión ha expirado, favor de iniciar sesión.','warning');
      
      return of(false);
    }));
    

  }
}
