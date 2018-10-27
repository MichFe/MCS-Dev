import { Component, OnInit } from '@angular/core';
import { VoiceRecorderService } from '../../services/voice-recorder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../services/shared.service';
import { ClienteService } from '../../services/clientes/cliente.service';
import { Cliente } from '../../models/cliente.model';
import swal from "sweetalert";

@Component({
  selector: "app-crm",
  templateUrl: "./crm.component.html",
  styleUrls: ["./crm.component.custom.css"]
})
export class CrmComponent implements OnInit {

  //------------------------------
  //Variables Generales
  //------------------------------

  //Variable de termino de busqueda para buscador de clientes
  terminoBusqueda: string = "";

  //Variables que identifican al cliente seleccionado
  clienteActual: any = {};
  indexClienteActual: number;

  //Variable que identifica el proyecto seleccionado
  indexProyectoActual: number;

  mensaje: string = "";

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

  proyectos: any = [
    {
      clientId: 1,
      nombre: "Sala Cafetería",
      imagen: "../assets/images/gallery/chair.jpg",
      estatus: "Activo",
      chatProyecto: [
        {
          usuario: {
            nombre: "Michelle Felix",
            imagen: "../assets/images/users/1.jpg"
          },
          mensaje:
            "Lorem Ipsum is simply dummy text of the printing & type setting industry.",
          fecha: "21/09/2018",
          hora: "12:00 pm"
        },
        {
          usuario: {
            nombre: "Rodrigo Martinez",
            imagen: "../assets/images/users/2.jpg"
          },
          mensaje: "Hola",
          fecha: "21/09/2019",
          hora: "3:00 pm"
        }
      ]
    }
  ];

  chats: any = [];

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
    private _clientesServicio: ClienteService
  ) {

    this.obtenerClientes(1);
    
  }

  obtenerClientes(pagina){

    this._clientesServicio.obtenerClientes(pagina).subscribe((resp: any) => {
      this.clientes = resp.clientes;

      this.buscarCliente();
      this.cambiarColorIniciales();
    });

  }

  cambiarColorIniciales(){

    this.clientesFiltrados.forEach((cliente, index) => {
      
      let color = this.randomColor();
      
      cliente.backgroundColor = color;
      
      this.clientesFiltrados[index] = cliente;

    });

  }

  seleccionarCliente(cliente, index) {
    this.clienteActual = cliente;
    this.indexClienteActual = index;

    this.shared.clienteSeleccionado = cliente;
    this.chatProyectos = true;
  }

  registrarClienteNuevo(nuevoCliente) {
    
    this._clientesServicio.guardarCliente(nuevoCliente).subscribe( 
      (resp:any)=>{
      
        console.log(resp);
        
      this.obtenerClientes(1);
      swal(
        'Registro exitoso',
        'El cliente ' + resp.cliente.nombre + ' se ha guardado correctamente!',
        'success'
      );
      
    },
    (error)=>{

      swal(
        'Registro fallido',
        error.error.mensaje + ' | ' + error.error.errors.message,
        'error'
      );

    }
  );

    this.clientes.push(nuevoCliente);
    this.buscarCliente();
  }

  guardarCambiosCliente(clienteActualizado:Cliente) {
    //Guardando cambios en base de datos
    this._clientesServicio.actualizarCliente( clienteActualizado ).subscribe( 
      (resp:any)=>{
      //Actualizando cliente actual localmente con la respuesta del servicio
      this.clienteActual=resp.cliente;
      swal(
        'Actualización exitosa',
        'El cliente ' + clienteActualizado.nombre + ' se ha actualizado correctamente!',
        'success'
      );
      
    },
    (error)=>{

      swal(
        'Actualización fallida',
        error.error.mensaje + ' | ' + error.error.errors.message,
        'error'
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

  agregarProyecto(proyecto) {
    let nuevoProyecto = {
      nombre: proyecto.nombreProyecto,
      imagen: "../assets/images/gallery/chair.jpg",
      descripcion: proyecto.descripcionProyecto,
      estatus: "Activo",
      chatProyecto: []
    };

    this.proyectos.push(nuevoProyecto);
  }

  scrollBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  agregarChat(event, esAudio) {
    //Previniendo comportamiento por default del botón enter
    if (event.keyCode == 13) {
      event.preventDefault();
    }
    //------------------------------------------------------

    //Evitando el envío de mensajes de texto vacios
    if (this.mensaje.trim().length <= 0 && !esAudio) {
      return;
    }
    //------------------------------------------------------

    //Evitando el envío de mensajes de audio vacios
    if (!this.audio.recordedAudio && esAudio) {
      return;
    }
    //------------------------------------------------------

    //Construyendo mensaje
    let chat: any = {
      usuario: {
        nombre: "Michelle Felix",
        imagen: "../assets/images/users/1.jpg"
      },
      mensaje: this.mensaje,
      audio: this.sanitizer.bypassSecurityTrustUrl(this.audio.recordedAudioUrl),
      fecha: "21/09/2018",
      hora: "12:00 pm"
    };
    //--------------------------------------------------------

    //Eliminando ruta audio en mensajes de texto
    if (!esAudio) {
      chat.audio = null;
    }
    //--------------------------------------------------------

    //Agregando el mensaje a arreglo de chats del proyecto
    this.proyectos[this.indexProyectoActual].chatProyecto.push(chat);
    //--------------------------------------------------------

    //Actualizando arreglo de chats actuales en chat body
    this.mostrarChatProyecto(this.indexProyectoActual);
    //--------------------------------------------------------

    //Limpiando text area
    this.mensaje = "";

    //Limpiando audio guardado
    this.audio.recordedAudio = null;
    this.audio.recordedAudioUrl = null;

    //Llamando Scroll
    let chatBody = document.getElementById("chatBody");
    setTimeout(() => {
      this.scrollBottom(chatBody);
    });
    //-------------------------------------------------------
  }

  mostrarChatProyecto(index) {
    this.chats = this.proyectos[index].chatProyecto;
    this.shared.proyectoSeleccionado = this.proyectos[index];
  }
  
  randomColor(){
  
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnInit() {}
}

