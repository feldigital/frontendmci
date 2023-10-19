
import { MiembroI } from './miembro.model';
import { ConsolidarUvidaI } from './consolidaruvida.model';

export class PostuladoUvidaI {
  idPostulado: number;
  idUvida: ConsolidarUvidaI =new ConsolidarUvidaI();
  idMiembro: MiembroI =new MiembroI();
  usuarioIngreso:String;
  fechaIngreso: Date;
  asistioEncuentro: boolean;
  bautizadoEncuentro: boolean;


  
  constructor() {
    this.idPostulado=NaN;
    this.asistioEncuentro = false;
    this.bautizadoEncuentro = false;
    this.usuarioIngreso="";
    this.fechaIngreso= new Date('');
  }
}


  