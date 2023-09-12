
import { MiembroI } from './miembro.model';
import { CelulaI } from './celula.model';

export class MiembroCelula {
  idCm: number=NaN;
  idCelula: CelulaI =new CelulaI();
  idMiembro: MiembroI =new MiembroI();
  fechaIngreso: Date;
  estado: boolean;


  
  constructor() {
    this.estado = true;
    this.fechaIngreso= new Date('');
  }
}
