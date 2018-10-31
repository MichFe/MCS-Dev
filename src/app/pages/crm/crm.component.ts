import { Component, OnInit } from '@angular/core';
import { VoiceRecorderService } from '../../services/voice-recorder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../services/shared.service';
import { ClienteService } from '../../services/clientes/cliente.service';
import { Cliente } from '../../models/cliente.model';
import swal from "sweetalert";
import { ProyectoService } from '../../services/proyectos/proyecto.service';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { ChatService } from '../../services/chats/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-crm",
  templateUrl: "./crm.component.html",
  styleUrls: ["./crm.component.custom.css"]
})
export class CrmComponent implements OnInit {
  //------------------------------
  //Variables Generales
  //------------------------------

  fechaActual: Date = new Date();

  infScrollChats: boolean = false;
  infScrollClientes: boolean = false;

  //Variable de termino de busqueda para buscador de clientes
  terminoBusqueda: string = "";

  //Variables que identifican al cliente seleccionado
  clienteActual: any = {};
  indexClienteActual: number;

  //Variable que identifica el proyecto seleccionado
  indexProyectoActual: number;

  mensaje: string = "";
  tipoMensaje: string;

  totalChatsProyecto: number;
  totalClientes: number;

  //------------------------------
  // FIN de Variables Generales
  //------------------------------

  //-------------------
  //Data
  //-------------------

  clientes: any[] = [
    {
      nombre: "Michelle Felix",
      telefono: "477-123-45-67",
      direccion: "Marioano Escobedo 1300, Centro, León, Guanajuato",
      correo: "mobla@gmail.com",
      imagen: "../assets/images/users/1.jpg",
      estatus: "Activo",
      clientId: 1
    },
    {
      nombre: "Rodrigo Martinez",
      imagen: "../assets/images/users/2.jpg",
      telefono: "477-123-45-67",
      direccion: "Marioano Escobedo 1300, Centro, León, Guanajuato",
      correo: "mobla@gmail.com",
      estatus: "Inactivo",
      clientId: 2
    }
  ];

  clientesFiltrados: any[] = [];

  proyectos: any = [];
  proyectoActual: any = {};

  chats: any[] = [];

  //-------------------
  //Data
  //-------------------

  //-------------------------------
  //Flag variables
  //-------------------------------

  //Flag - Variable para activar o desactivar la vista chat proyectos
  chatProyectos: boolean = false;
  //Flag - Variable para controlar la animacion boton grabando
  grabandoAudio: boolean = false;

  //-------------------------------
  //FIN de Flag variables
  //-------------------------------

  constructor(
    private audio: VoiceRecorderService,
    private sanitizer: DomSanitizer,
    private shared: SharedService,
    private _clientesServicio: ClienteService,
    private _proyectoService: ProyectoService,
    public _usuarioService: UsuarioService,
    private _chatService: ChatService,
    public router: Router
  ) {
    this.obtenerFechaActual();

    this.obtenerClientes(0);
  }

  resetRegresarAVistaCliente(){
    this.chatProyectos = false;
    this.infScrollChats=false;
    this.infScrollClientes=true;
    this.chats = [];
    this.proyectoActual = {};
  }

  obtenerFechaActual() {
    this.fechaActual = new Date();
  }

  obtenerProyectos(clienteId, pagina) {
    this._proyectoService.getProyectos(clienteId, pagina).subscribe(
      (resp: any) => {
        this.proyectos = resp.proyectos;
      },
      error => {
        swal(
          "Carga de proyectos fallida",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  agregarProyecto(proyecto) {
    this._proyectoService.postProyecto(proyecto).subscribe(
      resp => {
        this.obtenerProyectos(this.clienteActual._id, 1);
      },
      error => {
        swal(
          "Registro de proyecto fallido",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );

    // this.proyectos.push(proyecto);
  }

  obtenerClientes(desde) {
    this._clientesServicio.obtenerClientes(desde).subscribe(
      (resp: any) => {
      this.clientes = resp.clientes;

      this.buscarCliente();
      this.cambiarColorIniciales();
      this.totalClientes = resp.totalClientes;
      this.infScrollClientes = true;
    },
      (error) => {
        swal(
          "Error en carga inicial de clientes",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
  );
  }

  cambiarColorIniciales() {
    this.clientesFiltrados.forEach((cliente, index) => {
      let color = this.randomColor();

      cliente.backgroundColor = color;

      this.clientesFiltrados[index] = cliente;
    });
  }

  seleccionarCliente(cliente, index) {
    this.infScrollClientes=false;
    this.obtenerProyectos(cliente._id, 0);

    this.clienteActual = cliente;
    this.indexClienteActual = index;

    this.shared.clienteSeleccionado = cliente;
    this.chatProyectos = true;
  }

  registrarClienteNuevo(nuevoCliente) {
    this._clientesServicio.guardarCliente(nuevoCliente).subscribe(
      (resp: any) => {
        this.obtenerClientes(0);
        swal(
          "Registro exitoso",
          "El cliente " +
            resp.cliente.nombre +
            " se ha guardado correctamente!",
          "success"
        );
      },
      error => {
        swal(
          "Registro de cliente fallido",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );

    this.clientes.push(nuevoCliente);
    this.buscarCliente();
  }

  guardarCambiosCliente(clienteActualizado: Cliente) {
    //Guardando cambios en base de datos
    this._clientesServicio.actualizarCliente(clienteActualizado).subscribe(
      (resp: any) => {
        //Actualizando cliente actual localmente con la respuesta del servicio
        this.clienteActual = resp.cliente;
        swal(
          "Actualización exitosa",
          "El cliente " +
            clienteActualizado.nombre +
            " se ha actualizado correctamente!",
          "success"
        );
      },
      error => {
        swal(
          "Actualización de cliente fallida",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );
  }

  buscarCliente() {
    this.clientesFiltrados = this.clientes.filter((cliente: any) => {
      let nombreCliente: string = cliente.nombre;

      return nombreCliente.includes(this.terminoBusqueda);
    });
  }

  recordAudio() {
    this.grabandoAudio = true;
    let stopButton = document.getElementById("stopButton");
    this.audio.grabarAudio(stopButton);
  }

  stopRecording() {
    this.grabandoAudio = false;
  }

  playAudio() {
    if (!this.audio.recordedAudio) {
      return;
    }
    this.audio.recordedAudio.play();
  }

  scrollBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  agregarChat(event, tipo) {
    //Previniendo comportamiento por default del botón enter
    if (event.keyCode == 13) {
      event.preventDefault();
    }
    //------------------------------------------------------

    //Evitando el envío de mensajes de texto vacios
    if (this.mensaje.trim().length <= 0 && tipo != "audio") {
      return;
    }
    //------------------------------------------------------

    //Evitando el envío de mensajes de audio vacios
    if (!this.audio.recordedAudio && tipo == "audio") {
      return;
    }
    //------------------------------------------------------

    //Obteniendo fecha actual
    this.obtenerFechaActual();
    //------------------------------------------------------

    //Construyendo mensaje
    let chat: any = {
      usuario: this._usuarioService.usuario,
      // usuario:{
      //   img:null,
      //   nombre: 'Michelle Felix',
      //   _id:'1111'
      // },
      tipo: tipo,
      proyectoId: this.proyectoActual._id,
      fecha: this.fechaActual,
      mensaje: this.mensaje,
      audio: this.sanitizer.bypassSecurityTrustUrl(this.audio.recordedAudioUrl),
      img: null
    };
    //--------------------------------------------------------

    //Eliminando ruta audio en mensajes de texto
    if (tipo != "audio") {
      chat.audio = null;
    }
    //--------------------------------------------------------

    //Guardando chat en base de datos
    this._chatService.guardarChat(chat, this.chats.length).subscribe(
      (resp) => {
      this.mostrarChatProyecto(this.proyectoActual);
    },
      (error) => {
        swal(
          "Error al cargar postear mensaje",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
  );
    //--------------------------------------------------------

    //Agregando el mensaje a arreglo de chats del proyecto
    // this.proyectos[this.indexProyectoActual].chatProyecto.push(chat);
    // this.chats.push(chat);
    //--------------------------------------------------------

    //Actualizando arreglo de chats actuales en chat body
    //--------------------------------------------------------

    //Limpiando text area
    this.mensaje = "";

    //Limpiando audio guardado
    this.audio.recordedAudio = null;
    this.audio.recordedAudioUrl = null;

    //Llamando Scroll

    //-------------------------------------------------------
  }

  mostrarChatProyecto(proyecto) {
    //Seteo el proyecto seleccionado como proyecto actual
    this.proyectoActual = proyecto;
    this.chats = [];
    this.totalChatsProyecto = 0;

    this._chatService
      .obtenerChats(proyecto._id, this.chats.length)
      .subscribe(
        (resp: any) => {

        this.totalChatsProyecto = resp.totalChats;

        resp.chats.forEach(chat => {
          this.chats.unshift(chat);
        });

        let chatBody = document.getElementById("chatBody");
        setTimeout(() => {
          this.scrollBottom(chatBody);
        });
        //Habilitamos inf scroll
        this.infScrollChats = true;
      },
      (error) => {
        swal(
          "Error en carga inicial de mensajes",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );

    // this.chats = this.proyectos[index].chatProyecto;
    // this.shared.proyectoSeleccionado = this.proyectos[index];
  }

  cargarMensajes() {
    //Deshabilitamos infScrollChats
    this.infScrollChats = false;
    if (this.chats.length >= this.totalChatsProyecto) {
      return;
    } else {
      this._chatService
        .obtenerChats(this.proyectoActual._id, this.chats.length)
        .subscribe(
          (resp: any) => {

          resp.chats.forEach(chat => {
            this.chats.unshift(chat);
          });

          //Rehabilitamos infScrollChats
          this.infScrollChats = true;
        },
        (error) => {
          swal(
            "Error al cargar clientes",
            error.error.mensaje + " | " + error.error.errors.message,
            "error"
          );
        }
      );
    }
  }

  cargarClientes() {    
    
    if (this.clientes.length >= this.totalClientes) {
      return;
    }

    this.infScrollClientes = false;

    this._clientesServicio
      .obtenerClientes(this.clientes.length)
      .subscribe(
        (resp: any) => {
        // console.log(resp);
        
        resp.clientes.forEach(cliente => {
          this.clientes.push(cliente);
        });

        this.buscarCliente();
        this.cambiarColorIniciales();

        this.infScrollClientes = true;
      },
      (error)=>{
        swal(
          "Error al cargar clientes",
          error.error.mensaje + " | " + error.error.errors.message,
          "error"
        );
      }
    );      
      
  }

  randomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnInit() {}

  
}

