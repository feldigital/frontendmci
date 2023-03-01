
import { CelulaI } from './celula.model';
import { MedioI } from './medio.model';

export class ReporteCelula {
    idRealizacionCelula: number;
    fechaCelula: Date;
    idCelula: CelulaI = new CelulaI();
    citaCelula: String;
    temaCelula: String;
    ofrendaCelula: number;
    idMedioCelula: MedioI = new MedioI();
    fecUsuario: Date;
    verificada:boolean;
    nroAsistentes:number;
    fecVerificada: Date;

  

    constructor() {
        this.idRealizacionCelula=NaN;
        this.fechaCelula = new Date();
        this.citaCelula = "";
        this.temaCelula = "";
        this.ofrendaCelula = 0;
        this.fecUsuario = new Date();
        this.verificada=false;
        this.nroAsistentes=0;
        this.fecVerificada=new Date();
        
    }
}
