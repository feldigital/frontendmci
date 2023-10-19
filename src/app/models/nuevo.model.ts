import { MiembroI } from "./miembro.model";
import { ReunionI } from "./reunion.model";


export class NuevoI {
    idGanados: number;
   // idMiembro: MiembroI = new MiembroI();
    idMiembro: number;
    usuarioIng: String
    nuevo: boolean;
    //idReunion: ReunionI = new ReunionI();
    idReunion: number;
    fechaReunion: Date;
    motivoOracion: String;
    //idMiembroQuienInvita: MiembroI = new MiembroI();
    idMiembroQuienInvita: number;
    fonollamada:boolean;
    fonovisita: boolean;
    disposicion: String;
    usuarioFonollamada: String;
    fecLlamada: Date;
    usuarioFonovisita: String;
    fecVisita: Date;
    observaciones:String
    



    constructor() {
        this.idGanados = NaN;
        this.idMiembro=NaN;
        this.nuevo = true
        this. idReunion=NaN;
        this.motivoOracion = "";
        this.usuarioIng = "";
        this.fechaReunion = new Date('');
        this.motivoOracion = "";
        this.idMiembroQuienInvita=NaN;
        this. fonollamada=false;
        this. fonovisita=false;
        this. disposicion="";
        this.usuarioFonollamada="";
        this.fecLlamada= new Date('');
        this.usuarioFonovisita="";
        this.fecVisita= new Date('');
        this.observaciones="";

    }
}

