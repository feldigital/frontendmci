import { TipoDocI } from "./tipodoc.model";

export class MiembroI {
  idMiembro: number;
  tipoDoc: TipoDocI = new TipoDocI();
  numDocumento: String;
  nomCompleto: String;
  fecNacimiento: Date;
  sexo: String;
  direccion: String;
  barrio: String;
  email: String;
  celular: String;
  ciudad: String;
  estadoCivil: String;
  bautizado: boolean;
  lider: boolean;
  fechaIngreso: Date;
  fechaBautismo: Date;
  estado: String;
  codigoLider: String;
  //liderInmediato: MiembroI = new MiembroI();
  liderInmediato: number;
  uvida: boolean;
  cdestino: boolean;
  imgPerfil: string;
  citaBiblica: string;
  textoBiblico: string;
  fechaUvida: Date;
  fechaCdestino: Date; 
  pwd: string;


  constructor() {
    this.idMiembro = NaN;
    this.numDocumento = "";
    this.nomCompleto = "";
    this.fecNacimiento = new Date();
    this.sexo = "";
    this.direccion = "";
    this.barrio = "";
    this.email = "";
    this.celular = "";
    this.ciudad = "";
    this.estadoCivil = "";
    this.bautizado = false;
    this.lider = false
    this.fechaIngreso = new Date();
    this.fechaBautismo = new Date("1900-01-01");
    this.estado = "";
    this.codigoLider = "";
    this.liderInmediato=NaN;
    this.uvida = false;
    this.cdestino = false;
    this.imgPerfil = "";
    this.citaBiblica = "";
    this.textoBiblico = "";
    this.fechaUvida = new Date("1900-01-01");
    this.fechaCdestino = new Date("1900-01-01");   
    this.pwd= "";

  }
}

