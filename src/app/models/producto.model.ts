export class Producto {

    constructor(

       public codigo: string,
       public nombre: string,
       public familia: string,
       public precio: number,
       public usuarioCreador: any,
       public usuarioUltimaModificacion: any,
       public img?: string,
       public tCarpinteria?: number,
       public tPulido1?: number,
       public tFondo?: number,
       public tPulido2?: number,
       public tTerminado?: number,
       public tEmpaque?: number,
       public _id?: string

    ) { }


}