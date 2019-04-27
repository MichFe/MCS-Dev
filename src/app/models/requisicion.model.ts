import {Usuario} from './usuario.model';
import {EstatusRequisicion} from '../enums/estatusRequisicion.enum';

export class Requisicion {

    constructor(
       public descripcion?: string,
       public cantidad?: string,
       public solicitante?: Usuario,
       public unidadDeNegocio?: string,
       public fechaSolicitud?: Date,
       public fechaCompromisoProveedor?:Date,
       public _id?: string,
       public estatus?: EstatusRequisicion,
       public aprobador?: string,
       public fechaAprobacionRechazo?: Date,
       public compraCreada?: boolean,
       public productoRecibido?: boolean,
       public seleccionada?: boolean
    ) { }


}
