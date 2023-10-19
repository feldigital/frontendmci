import { MiembroI } from "./miembro.model";
import { RedI } from "./red.model";


export class ConsolidarUvidaI {

    idUvida: number;
    idMiembroCoordinador: MiembroI = new MiembroI();
    cicloUvida: String;
    citaRemha: String;
    textoRemha: String;
    fechaEncuentro: Date;  
    idRed: RedI = new RedI();
    estado: boolean;
    usuario: String;
    fechaCreacion: Date;
  


    constructor() {
        this.idUvida = NaN;
        this.cicloUvida = "";
        this.citaRemha = "";
        this.textoRemha = "";
        this.fechaEncuentro = new Date('');
        this.estado = true;
        this.usuario = "";
        this.fechaCreacion    = new Date('');
      
    }

}




