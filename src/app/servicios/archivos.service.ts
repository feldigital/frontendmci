import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  private url = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com';

  constructor(private http: HttpClient) {
  }



  getUpload(file: File, token: string) {
    let body = new FormData();
    body.append("file", file);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.url + '/api/miembros/upload', body, { headers }).pipe(
      map(res => JSON.stringify(res))
    );
  }

  getFoto(key: string, token: string) {
    let parametros = new HttpParams();
    parametros = parametros.append('key', key);
    const opciones = {
      headers: new HttpHeaders({
      }),
      params: parametros
    };
    return this.http.get(this.url + '/api/archivos/get', opciones).pipe(
      map(res => JSON.stringify(res))
    );
  }

}