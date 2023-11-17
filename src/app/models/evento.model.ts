
export class EventoI {
    idEvento: number;
    nomEvento: String;
    valorEvento: number;    
    fechaEvento: Date; 
    estado: boolean;
    usuario: String;
    fechaCreacion: Date;
  


    constructor() {
        this.idEvento = NaN;
        this.nomEvento = "";
        this.valorEvento = NaN;
         this.fechaEvento = new Date('');
        this.estado = true;
        this.usuario = "";
        this.fechaCreacion    = new Date('');
      
    }

}

