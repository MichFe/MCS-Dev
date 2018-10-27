export class Cliente {

    constructor(
        public nombre: string,
        public telefono: string,
        public direccion: string,
        public email?: string,
        public estatus?: string,
        public img?: string,
        public _id?: string,
        public usuarioCreador?: any,
        public usuarioUltimaModificacion?: any,
    ) { }


}