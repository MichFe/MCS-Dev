export class Usuario{

    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public unidadDeNegocio: string,
        public role?:string,
        public img?: string,
        public _id?: string,
    ){}


}