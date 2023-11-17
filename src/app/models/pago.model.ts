export class PagoI {
    idPago: number;
    idEvento: number;
    idMiembro: number;
    valorPago: number;
    fechaPago: Date;
    medioPago: String;
    obsPago: String;
    usuario: String;
    fechaCreacion: Date;
    nomUsuario: String;

    constructor() {
        this.idPago = NaN;
        this.idEvento = NaN;
        this.idMiembro = NaN;
        this.valorPago = NaN;
        this.fechaPago = new Date('');
        this.medioPago = "";
        this.obsPago = "";
        this.usuario = "";
        this.fechaCreacion = new Date('');
        this.nomUsuario="";
    }

}

