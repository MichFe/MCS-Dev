import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.css']
})
export class GestionEmpleadosComponent implements OnInit {

  //Data
  usuarios:any[] = [];
  nuevoUsuario = {
    nombre: "",
    email: "",
    password: "123456",
    role: "USER_ROLE",
    unidadDeNegocio: "",
    salario: 0
  };

  creandoUsuario:boolean=false;

  constructor(
    private _usuarioService:UsuarioService
  ) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  toggleCreandoUsuario(){
    if(this.creandoUsuario){
      this.creandoUsuario=false;
    }else{
      this.creandoUsuario=true;
    }
  }

  crearNuevoUsuario(nuevoUsuario){
    this._usuarioService.crearUsuario(nuevoUsuario).subscribe(
      (resp)=>{

        this.obtenerUsuarios();

        //Reset nuevoUsuario
        this.nuevoUsuario.nombre= "";
        this.nuevoUsuario.email= "";
        this.nuevoUsuario.password= "123456";
        this.nuevoUsuario.role= "USER_ROLE";
        this.nuevoUsuario.unidadDeNegocio= "";
        this.nuevoUsuario.salario= 0;

        //Toggle creando usuario
        this.toggleCreandoUsuario();

        
    },
    (error)=>{

    })
  }

  obtenerUsuarios(){
    this._usuarioService.obtenerTodosLosUsuarios().subscribe(
      (resp:any)=>{
        this.usuarios = resp.usuarios;
      },
      (error)=>{

      })
  }

  eliminarUsuario(usuario, i){
    this._usuarioService.eliminarUsuario(usuario).subscribe(
      (resp)=>{
        this.obtenerUsuarios();
    },
    (error)=>{

    })
  }

  crearCeldaTemporal(celda){
    let editableCell: any = celda.cloneNode();
    celda.parentNode.replaceChild(editableCell, celda);

    editableCell.contentEditable = true;
    editableCell.style.backgroundColor = '#caebf1';

    return editableCell;
  }

  actualizarEmail(event,i){
    let celda:HTMLElement = event.srcElement;
    let editableCell = this.crearCeldaTemporal(celda);

    editableCell.addEventListener("keyup", (keyup)=>{
      if(keyup.keyCode == 13){

        this.usuarios[i].email = editableCell.innerText.trim();
        editableCell.blur();

      }
    });

    editableCell.addEventListener("blur", ()=>{
      editableCell.parentNode.replaceChild(celda, editableCell);
      editableCell.remove();
    });

    editableCell.focus();
  }

  actualizarSalario(event,i){

    let celda:HTMLElement=event.srcElement;
    let editableCell = this.crearCeldaTemporal(celda);

    editableCell.addEventListener("keyup", (keyup)=>{
      let inputNumber = Number(editableCell.innerText.trim());

      if(keyup.keyCode == 13){

        if( !isNaN(inputNumber) ){
          this.usuarios[i].salario = inputNumber;
        }
      
        editableCell.blur();
      }
      
    });

    editableCell.addEventListener('blur', ()=>{
      editableCell.parentNode.replaceChild(celda,editableCell);
      editableCell.remove();
    });

    editableCell.focus();

  }

  guardarCambiosUsuario(usuario, i){
    this._usuarioService.actualizarOtroUsuario(usuario).subscribe(
      (resp:any)=>{
        this.usuarios[i]=resp.usuario;
        
        swal(
          "Usuario Actualizado",
          "El usuario ha sido actualizado correctamente",
          "success"
        );
    },
    (error)=>{
      swal(
        "Error al actualizar usuario",
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    })
    
  }

}
