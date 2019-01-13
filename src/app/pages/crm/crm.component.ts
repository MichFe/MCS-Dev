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
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ImageUploadService } from '../modal/image-upload/image-upload.service';

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
  imagenChat:File;
  imagenChatTemporal: string | ArrayBuffer;
  imagenChatTemporalUrl:string;

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

  imagenClienteNuevo:File;

  constructor(
    public audio: VoiceRecorderService,
    private sanitizer: DomSanitizer,
    private shared: SharedService,
    private _clientesServicio: ClienteService,
    private _proyectoService: ProyectoService,
    public _usuarioService: UsuarioService,
    private _chatService: ChatService,
    public router: Router,
    public _subirArchivoService:SubirArchivoService,
    public _imageUploadService:ImageUploadService
  ) {
    this.obtenerFechaActual();

    this.obtenerClientes(0);
  }

  cargarImagenChat(evento){

    //Creamos input invisible
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    //Creamos una promesa agregando el evento onchange al input y disparando el evento click en el input
    let promesa = new Promise((resolve,reject)=>{

      input.onchange = ()=>{
        //Obtenemos la imagen
        let file: File = input.files[0];

        //Si no hay imagen borramos imagen temporal y salimos de la funcion
        if (!file) {
          this.imagenChat = null;
          this.imagenChatTemporal = null,
          this.imagenChatTemporalUrl = null;
          return;
        }

        //Si el tipo de archivo no es imagen mostramos mensaje de error y salimos de la funcion
        if (file.type.indexOf('image') < 0) {
          swal(
            'Típo de archivo inválido',
            'Seleccione una imágen',
            'error'
          );

          this.imagenChat = null;
          this.imagenChatTemporal = null,
          this.imagenChatTemporalUrl = null;
          return;
        }

        let reader = new FileReader();        
        this.imagenChat = file;
        reader.onloadend = () => this.imagenChatTemporal = reader.result;
        this.imagenChatTemporalUrl = URL.createObjectURL(file);
        

        //Avisamos a la promesa de que se ha completado mediante resolve
        resolve();
      }

      input.click();
    });

    promesa.then(
      (resolve)=>{
        //Mensaje de confirmación de carga de imagen
        swal("Confirmación:","Esta seguro de que desea envíar esta imagen",{
          buttons: ['Cancelar', 'Ok'],
          icon: this.imagenChatTemporalUrl
        })
          .then(
            (enviar) => {
              
              //Manejamos caso de confirmación de carga
              if (enviar) {
                this.agregarChat(evento,'imagen');
                
              //Manejamos cancelación de carga
              }else{
                this.imagenChat=null;
                this.imagenChatTemporal=null,
                this.imagenChatTemporalUrl=null;
              }

          });
      }
    );
  }

  imagenNuevoCliente(file){
    this.imagenClienteNuevo=file;
  }

  resetRegresarAVistaCliente() {
    this.chatProyectos = false;
    this.infScrollChats = false;
    this.infScrollClientes = true;
    this.chats = [];
    this.proyectos = [];
    this.proyectoActual = {};

    this.obtenerClientes(0);

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
      (resp: any) => {
        this.obtenerProyectos(this.clienteActual._id, 1);
        swal(
          "Registro de proyecto exitoso",
          "El proyecto " +
            resp.proyecto.nombre +
            "se ha guardado de manera exitosa.",
          "success"
        );
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

        this.clientesFiltrados = this.clientes;
        this.cambiarColorIniciales();
        this.totalClientes = resp.totalClientes;
        this.infScrollClientes = true;
      },
      error => {
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
    this.infScrollClientes = false;
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

        let cliente=resp.cliente;

        this._subirArchivoService.subirArchivo( this.imagenClienteNuevo, 'cliente', cliente._id )
            .then( resp=>{
              console.log(resp);
              
            });

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

    //Reseteamos lista de clientes cuando limpiamos el campo de busqueda
    if (!this.terminoBusqueda){
      
      this.obtenerClientes(0);
      //Habilitamos infinite scroll de clientes
      this.infScrollClientes=true;
      return;
    }

    //Evitamos busquedas con terminos menores a 3 caracteres
    if (this.terminoBusqueda.length<=3) {

      return;
    }

    //Ejecutamos la consulta
    this._clientesServicio.buscarCliente(this.terminoBusqueda).subscribe(
      (resp: any) => {

        //Manejamos el caso en el que no hay coincidencias con el termino
        if (resp.cliente.length == 0) {
          swal(
            "Busqueda no concluyente",
            "No se encontraron clientes que coincidan con la busqueda: " +
              this.terminoBusqueda,
            "warning"
          );
          return;
        }

        //Deshabilitamos infinite scroll de clientes
        this.infScrollClientes = false;
        //Cargamos los clientes que hacen match con el termino
        this.clientesFiltrados = resp.cliente;
      },
      error => {
        swal("Busqueda de cliente fallida", "Error al buscar cliente", "error");
      }
    );
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
    if (!this.audio.audioPlay) {
      return;
    }
    this.audio.audioPlay.play();
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
    if (this.mensaje.trim().length <= 0 && tipo != "audio" && tipo !="imagen") {
      return;
    }
    //------------------------------------------------------

    //Evitando el envío de mensajes de imagen vacios--------
    if( !this.imagenChat && tipo =='imagen'){      

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
      usuario: this._usuarioService.usuario._id,
      // usuario:{
      //   img:null,
      //   nombre: 'Michelle Felix',
      //   _id:'1111'
      // },
      tipo: tipo,
      proyectoId: this.proyectoActual._id,
      fecha: this.fechaActual,
      mensaje: this.mensaje,
      audio: null,
      img: null
    };
    //--------------------------------------------------------

    //Eliminando ruta audio en mensajes de texto
    if (tipo != "audio") {
      chat.audio = null;
    }
    //--------------------------------------------------------

    //Eliminando ruta de imagen en mensajes de texto--------------
    if(tipo != "imagen"){
      chat.img=null;
    }
    //------------------------------------------------------------

    //Guardando chat en base de datos
    this._chatService.guardarChat(chat, this.chats.length).subscribe(
      (resp:any) => {

        //Si es de tipo audio, manejamos la carga del audio
        if(tipo==='audio'){
          this._subirArchivoService.subirAudio(this.audio.recordedAudio, 'chat', resp.chat._id)
            .then(
              (resp) => {

                this.mostrarChatProyecto(this.proyectoActual);
                this.audio.recordedAudio = null;
                this.audio.recordedAudioUrl = null;
                this.audio.audioPlay=null;
              }
            );
        }else{
          if (tipo ==='imagen'){
            
            this._subirArchivoService.subirArchivo(this.imagenChat,'chat', resp.chat._id)
            .then(
              (resp)=>{
                this.mostrarChatProyecto(this.proyectoActual);
                this.imagenChat=null;
                this.imagenChatTemporal=null;
                this.imagenChatTemporalUrl=null;
              }
            );

          }else{
            this.mostrarChatProyecto(this.proyectoActual);

            //Limpiando text area
            this.mensaje = "";
          }

          

          
        }
        
      },
      error => {
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

    

    //Llamando Scroll

    //-------------------------------------------------------
  }

  mostrarChatProyecto(proyecto) {
    //Seteo el proyecto seleccionado como proyecto actual
    this.proyectoActual = proyecto;
    this.chats = [];
    this.totalChatsProyecto = 0;

    this._chatService.obtenerChats(proyecto._id, this.chats.length).subscribe(
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
      error => {
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
          error => {
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

    this._clientesServicio.obtenerClientes(this.clientes.length).subscribe(
      (resp: any) => {
        // console.log(resp);

        resp.clientes.forEach(cliente => {
          this.clientes.push(cliente);
        });

        this.clientesFiltrados = this.clientes;
        this.cambiarColorIniciales();

        this.infScrollClientes = true;
      },
      error => {
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

