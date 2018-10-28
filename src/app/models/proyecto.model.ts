export class Proyecto {

    constructor(
        public nombre: string,
        public descripcion: string,
        public clienteId: string,
        public estatus: string,
        public chatId?: string,
        public usuarioCreador?: string,
        public usuarioUltimaModificacion?: string,
        public _id?: string,
        public img?:string
    ) { }


}