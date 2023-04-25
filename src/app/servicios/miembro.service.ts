import { Injectable } from '@angular/core';
import { MiembroI } from 'src/app/models/miembro.model';
import { TipoDocI } from 'src/app/models/tipodoc.model';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReunionI } from '../models/reunion.model';

@Injectable()
export class MiembroService {
  
  private urlEndPoint: string = 'http://localhost:8080/api/miembros';
  //private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/miembros';
  

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

/* este es para el backen actal
  getMiembrosLideres(): Observable<any> {
    return this.http.get(this.urlEndPoint + '/lideres').pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }*/

  getMiembrosLideres(id: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/lideres/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMiembrosDocumento(documento: String): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/documento/${documento}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMinisterio12(idLider: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/ministerio12/${idLider}`).pipe(
      //console.log(${this.urlEndPoint}/ministerio/${idLider});
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getMinisterio144(idLider: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/ministerio144/${idLider}`).pipe(
      //console.log(${this.urlEndPoint}/ministerio/${idLider});
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMiembrosMinisterio(idLider: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/ministerio/${idLider}`).pipe(
      //console.log(${this.urlEndPoint}/ministerio/${idLider});
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getMiembro(id: any): Observable<MiembroI> {
    return this.http.get<MiembroI>(`${this.urlEndPoint}/${id}`).pipe(
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

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`).pipe(
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
}