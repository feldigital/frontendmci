
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
    usuarioIng: String;
    fecUsuario: Date;
    verificada:boolean;
    nroAsistentes:number;
    usuarioVer: String;
    fecVerificada: Date;

  

    constructor() {
        this.idRealizacionCelula=NaN;
        this.fechaCelula = new Date('');
        this.citaCelula = "";
        this.temaCelula = "";
        this.ofrendaCelula = 0;
        this.usuarioIng="";
        this.fecUsuario = new Date('');
        this.verificada=false;
        this.nroAsistentes=0;
        this.usuarioVer="";
        this.fecVerificada=new Date('');
        
    }
}
