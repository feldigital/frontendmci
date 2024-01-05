import { Injectable } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { TipoDocI } from 'src/app/models/tipodoc.model';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReunionI } from '../models/reunion.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class MiembroService {
  
  //private urlEndPoint: string = 'http://localhost:8080/api/miembros';  
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/miembros';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/miembros';
  
  private urlEndPoint = environment.apiUrl+'/miembros';

  constructor(private http: HttpClient, private router: Router) { }

  getTipos(): Observable<any> {
    return this.http.get<TipoDocI[]>(this.urlEndPoint + '/tipos_documentos').pipe(
      catchError(e => {
        return throwError(e);
      })
    );;
  }
  getReuniones(): Observable<any> {
    return this.http.get<ReunionI[]>(this.urlEndPoint + '/reunion').pipe(
      catchError(e => {
        return throwError(e);
      })
    );;
  }

  getMiembros(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getMiembrosCelula(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  
  getMiembrosPostulados(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/postulados`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  getMiembrosLideres(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.urlEndPoint}/lideres`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


// const params = new HttpParams().set('id', documento);  
  getMiembrosDocumento(documento: string): Observable<any> {
    let parametros = new HttpParams();
    parametros = parametros.append('id', documento);  
    const opciones = {
      headers: new HttpHeaders({
      }),
      params: parametros
    };      
    return this.http.get(`${this.urlEndPoint}/documento`,opciones).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMinisterio12(idLider: any): Observable<any> {
    const params = new HttpParams().set('id', idLider);
    return this.http.get(`${this.urlEndPoint}/ministerio12`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getMinisterio144(idLider: any): Observable<any> {
    const params = new HttpParams().set('id', idLider);
    return this.http.get(`${this.urlEndPoint}/ministerio144`,{params}).pipe(
    
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMiembrosMinisterio(idLider: any): Observable<any> {
    const params = new HttpParams().set('id', idLider);
    return this.http.get(`${this.urlEndPoint}/ministerio`,{params}).pipe(    
      catchError(e => {
        return throwError(e);
      })
    );
  }
  
  getReporteMinisterio(idLider: any): Observable<any> {
    const params = new HttpParams().set('id', idLider);
    return this.http.get(`${this.urlEndPoint}/reporteministerio`,{params}).pipe(      
      catchError(e => {
        return throwError(e);
      })
    );
  }


  getMiembro(id: any): Observable<MiembroI> {
    const params = new HttpParams().set('id', id);
    return this.http.get<MiembroI>(`${this.urlEndPoint}/unico`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/miembros']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public create(registro: MiembroI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<MiembroI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: MiembroI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<MiembroI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public delete(id: any): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.urlEndPoint}`,{params}).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  subirFoto(archivo: File, id: string | number | Blob): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  public enviarCorreo(registro: MiembroI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<MiembroI>(`${this.urlEndPoint}/enviarCorreo`,JSON.stringify(registro),  { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}