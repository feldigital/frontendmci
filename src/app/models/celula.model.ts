import { MiembroI } from "./miembro.model";
import { RedI } from "./red.model";
import { MiembroCelula } from "./miembrocelula.model";

export class CelulaI {
    idCelula: number;
    idMiembroLider: MiembroI = new MiembroI();
    nombreAnfitrion: String;
    direccion: String;
    barrio: String;
    fecApertura: Date;
    diaCelula: String;
    horaCelula: String;
    idRed: RedI = new RedI();
    estado: String;
    usuario: String;
    fecUsuario: Date;
    gcompleto: boolean;


    constructor() {
        this.idCelula = NaN;
        this.nombreAnfitrion = "";
        this.direccion = "";
        this.barrio = "";
        this.fecApertura = new Date('');
        this.diaCelula = "";
        this.horaCelula = "";
        this.estado = "Activa";
        this.usuario = "";
        this.fecUsuario = new Date('');
        this.gcompleto=false;
    }

}
