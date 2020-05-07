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
import { URL_SERVICIOS } from 'src/app/config/config';
import { RegistroLecturaService } from 'src/app/services/registroLectura/registro-lectura.service';

declare var $:any;

@Component({
  selector: "app-crm",
  templateUrl: "./crm.component.html",
  styleUrls: ["./crm.component.custom.css"]
})
export class CrmComponent implements OnInit {

  //Inputs cotizacion
  indiceCotizacion=0;
  //------------------------------
  //Variables Generales
  //------------------------------

  fechaActual: Date = new Date();

  infScrollChats: boolean = false;
  infScrollClientes: boolean = false;
  infScrollProyectos: boolean = false;

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
  totalProyectos: number;

  imagenAgrandada:any;
  finDeChats:boolean=false;

  registroLectura:any[];

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

  proyectos: any[] = [];
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
    public _imageUploadService:ImageUploadService,
    public _registroLectura: RegistroLecturaService
  ) {
    this.obtenerFechaActual();

    this.obtenerClientes(0);
  }

  eliminarProyecto(proyectoId){
    let valorAnteriorInfScrollChats = this.infScrollChats;
    this.infScrollChats=false;
    //Mensaje de confirmación de carga de imagen
    swal("Confirmación:", "Esta seguro de que desea eliminar el proyecto?", {
      buttons: ['Cancelar', 'Ok'],
    })
      .then(
      (eliminar) => {

        if(eliminar){
          this._proyectoService.eliminarProyecto(proyectoId).subscribe(
            (resp) => {

              swal(
                "Proyecto eliminado exitosamente",
                "El proyecto: " + this.proyectoActual.nombre + ", se ha eliminado exitosamente",
                "success"
              );

              this.obtenerProyectos(this.clienteActual._id, 0);
              this.chats = [];
              this.proyectoActual = {};
              this.infScrollChats=valorAnteriorInfScrollChats;
            },
            error => {
              this.infScrollChats = valorAnteriorInfScrollChats;
              swal(
                "Error al eliminar mensaje",
                error.error.mensaje + " | " + error.error.errors.message,
                "error"
              );
            }
          );
        }else{
          this.infScrollChats = valorAnteriorInfScrollChats;
          return;
        }
      });


    
  }

  eliminarChat(chatId){

    //Mensaje de confirmación de carga de imagen
    swal("Confirmación:", "Esta seguro de que desea eliminar el mensaje", {
      buttons: ['Cancelar', 'Ok'],
    })
      .then(
        (eliminar) => {

          //Manejamos caso de confirmación de carga
          if (eliminar) {

            this._chatService.eliminarChat(chatId).subscribe(
              (resp) => {

                this.mostrarChatProyecto(this.proyectoActual);

                swal(
                  "Mensaje eliminado exitosamente",
                  "El mensaje se ha eliminado exitosamente",
                  "success"
                );
              },
              error => {
                swal(
                  "Error al eliminar mensaje",
                  error.error.mensaje + " | " + error.error.errors.message,
                  "error"
                );
              }
            );

          } else {
            return;
          }

        });


    
  }

  mostrarImagenDeChat(urlImagen:string){
    this.imagenAgrandada = urlImagen;

    $('#imageDisplay').modal('toggle');
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
        this.totalProyectos = resp.totalProyectos;
        this.obtenerTotalMensajesPorProyecto(clienteId);
        this.infScrollProyectos = true;
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

  obtenerTotalMensajesPorProyecto(clienteId){

    this._chatService.obtenertotalDeMensajesPorProyecto(clienteId).subscribe(
      (resp:any)=>{

        this.agregarAProyectosTotalDeMensajes(resp.conteoMensajes);      
        this.agregarAProyectosMensajesLeidos();
      }
    );
  }

  agregarAProyectosMensajesLeidos(){
    //Seteo los mensajes leidos a cero
    this.proyectos.forEach((proyecto, i)=>{
      this.proyectos[i].mensajesLeidos = 0;
    });

    let indexProyecto;

    this.proyectos.forEach((proyecto, index)=>{
      indexProyecto = index;
      
      this.registroLectura.forEach((registro)=>{

        if(proyecto._id==registro.proyectoId){
          
          this.proyectos[indexProyecto].mensajesLeidos = registro.chatsLeidos;

        }

      });

    });    

  }

  agregarAProyectosTotalDeMensajes(registros:any[]){

    registros.forEach((registro)=>{

      this.proyectos.forEach((proyecto,i)=>{
        if(proyecto._id==registro._id){
          this.proyectos[i].totalMensajes=registro.conteoMensajes;
        }
      });

    });

  }

  agregarProyecto(proyecto) {
    this._proyectoService.postProyecto(proyecto).subscribe(
      (resp: any) => {
        this.obtenerProyectos(this.clienteActual._id, 0);
        let proyectosDiv = document.getElementById("proyectosDiv");
        this.scrollTop(proyectosDiv);
        swal(
          "Registro de proyecto exitoso",
          "El proyecto " +
            resp.proyecto.nombre +
            " se ha guardado de manera exitosa.",
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

  obtenerMensajesTotalesPorCliente(){

    this._chatService.obtenerTotalDeMensajesPorCliente().subscribe(
      (resp:any)=>{
        this.agregarAClientesTotalDeMensajes(resp.conteoDeMensajes);
      }
    );
  }

  agregarAClientesTotalDeMensajes(totalMensajes:any[]){

    //Reseteo a cero el total de mensajes de los clientes
    this.clientes.forEach((cliente, i) => {
      this.clientes[i].totalMensajes = 0;
    });

    //Por cada total de mensajes por cliente devuelto por el server
    //buscamos el cliente en la lista y le agregamos su total de mensajes
    totalMensajes.forEach((registroCliente)=>{

      this.clientes.forEach( (cliente,i)=>{
          if(cliente._id==registroCliente._id){
            this.clientes[i].totalMensajes=registroCliente.conteoMensajes;
          }
      });

    });
    

  }
  

  obtenerRegistroLecturaPorCliente(){
    this._registroLectura.obtenerRegistroLectura().subscribe(
      (resp:any)=>{
        
        this.registroLectura = resp.registroLectura.registroLecturaProyectos;
        this.agregarAClientesMensajesLeidos(resp.registroLectura.registroLecturaProyectos);

      },
      (error:any)=>{
        //Si el error es 400, quiere decir que no hay registro de lectura para ese cliente
        //Por lo que agregamos mensajesLeidos=0 a todos los clientes
        if(error.status==400){
          this.agregarAClientesMensajesLeidos([]);
        }
      }
    );
  }

  agregarAClientesMensajesLeidos(registroLectura:any[]){

    //Pongo en ceros el contador de mensajes leidos de todos los clientes
    this.clientes.forEach((cliente,i)=>{
      this.clientes[i].mensajesLeidos=0;
    });


    registroLectura.forEach( (registro)=>{
      
      //Por cada registro reviso el arreglo de clientes y si los chats son de un proyecto
      //Del cliente se suman a los mensajes leidos del cliente
      this.clientes.forEach((cliente,i)=>{
        if(cliente._id==registro.clienteId){
          this.clientes[i].mensajesLeidos+=registro.chatsLeidos;
        }
      });

      
    });
  }

  obtenerClientes(desde) {
    this._clientesServicio.obtenerClientes(desde).subscribe(
      (resp: any) => {
        this.clientes = resp.clientes;
        this.obtenerRegistroLecturaPorCliente();
        this.obtenerMensajesTotalesPorCliente();

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
    // if (this.terminoBusqueda.length<=3) {

    //   return;
    // }

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

  scrollTop(element){
    element.scrollTop = 0;
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

        //Actualizando fecha de ultimo mensaje en el cliente para ordenarlos
          this.clienteActual.fechaUltimoMensaje = chat.fecha;
          this._clientesServicio.actualizarCliente(this.clienteActual).subscribe();
          
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
        this.registrarLecturaDeMensajes(proyecto._id, resp.totalChats);

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

  registrarLecturaDeMensajes(proyectoId, totalChats){

    //Construimos el objeto lectura base (registro de lectura de los chats del proyecto actual)
    let registroLecturaProyecto = {
      clienteId: this.clienteActual._id,
      proyectoId: proyectoId,
      chatsLeidos: totalChats
    };

    //definimos una variable donde guardaremos el registro completo que devuelve la BD
    let registroLecturaBD:any;

    this._registroLectura.obtenerRegistroLectura().subscribe(
      (resp:any)=>{
        //Si exitse un registro lo guardamos en la variable que creamos anteriormente
        registroLecturaBD = resp.registroLectura;

        let existeRegistroPrevioDeProyecto: boolean = false;

        //Validamos si hay un registro previo para el proyecto en cuestion y de ser asi, lo reemplazamos 
        registroLecturaBD.registroLecturaProyectos.forEach((proyecto, index) => {
          if (proyecto.proyectoId == proyectoId) {
            registroLecturaBD.registroLecturaProyectos[index].chatsLeidos = totalChats;
            existeRegistroPrevioDeProyecto = true;
          }
        });

        //Si no hay registro previo lo anexamos al array
        if (!existeRegistroPrevioDeProyecto) {
          registroLecturaBD.registroLecturaProyectos.push(registroLecturaProyecto);
        }

        //Actualizamos la BD con los valores de la nueva lectura
        this._registroLectura.actualizarRegistroLectura(registroLecturaBD).subscribe(
          (resp) => {

          },
          (err) => {

          });
        
      },
      (err)=>{
        //Si el error es 400 quiere decir que no existe un registro
        //Así que creamos el registro
        if(err.status==400){

          //Creamos la entrada para nuestra base de datos
          let nuevoRegistroDeLectura={
            usuario: this._usuarioService.id,
            registroLecturaProyectos:[]
          };

          //Agregamos el registro del proyecto al array
          nuevoRegistroDeLectura.registroLecturaProyectos.push(registroLecturaProyecto);

          //Creamos el nuevo registro mediante nuestro servicio
          this._registroLectura.crearRegistroLectura(nuevoRegistroDeLectura).subscribe(
            (resp:any)=>{
              this._registroLectura.registroLectura = resp.registroDeLectura;
              return;
            }
          );
        }

      });

      

  }

  cargarMensajes() {
    //Deshabilitamos infScrollChats
    this.infScrollChats = false;
    this.finDeChats = false;
    if (this.chats.length >= this.totalChatsProyecto) {
      this.finDeChats = true;
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

  cargarProyectos(){
    if(this.proyectos.length >= this.totalProyectos){
      return;
    }

    this.infScrollProyectos = false;
    let pagina = this.proyectos.length;

    this._proyectoService.getProyectos(this.clienteActual._id ,pagina).subscribe(
      (resp:any)=>{
        resp.proyectos.forEach((proyecto)=>{
          this.proyectos.push(proyecto);
        });

        this.infScrollProyectos = true;
    },
    (error)=>{
      swal(
        "Error al cargar croyectos",
        error.error.mensaje + " | " + error.error.errors.message,
        "error"
      );
    });

  }

  cargarClientes() {
    if (this.clientes.length >= this.totalClientes) {
      return;
    }

    this.infScrollClientes = false;

    this._clientesServicio.obtenerClientes(this.clientes.length).subscribe(
      (resp: any) => {

        resp.clientes.forEach(cliente => {
          this.clientes.push(cliente);
        });

        this.clientesFiltrados = this.clientes;
        this.cambiarColorIniciales();

        this.obtenerMensajesTotalesPorCliente();
        this.agregarAClientesMensajesLeidos(this.registroLectura);


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

