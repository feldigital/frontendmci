
import { MiembroI } from './miembro.model';
import { ReporteCelula } from './reportecelula.model';

export class AsistenciaCelula {
    idDac:number;
    idRealizacionCelula: ReporteCelula= new ReporteCelula();   
    idMiembroDiscipulo: MiembroI = new MiembroI();

    constructor() {
        this.idDac=NaN;       
    }
}
