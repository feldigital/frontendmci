
import { Injectable } from '@angular/core';
import { CelulaI } from 'src/app/models/celula.model';
import { MiembroI } from 'src/app/models/miembro.model';
import { RedI } from 'src/app/models/red.model';
import { MedioI } from 'src/app/models/medio.model';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MiembroService } from './miembro.service';
import { MiembroCelula } from '../models/miembrocelula.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class CelulaService {
  //private urlEndPoint: string = 'http://localhost:8080/api/celulas';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/celulas';
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/celulas';
  private urlEndPoint = environment.apiUrl+'/celulas';

  constructor(private http: HttpClient, private router: Router) { }

  getRed(): Observable<any> {
    return this.http.get<RedI[]>(this.urlEndPoint + '/red').pipe(
      catchError(e => {
        return throwError(e);
      })
    );;
  }

  getMedio(): Observable<any> {
    return this.http.get<MedioI[]>(this.urlEndPoint + '/medio_celula').pipe(
      catchError(e => {
        return throwError(e);
      })
    );;
  }

  
    getCelulas(): Observable<any> {
      return this.http.get(this.urlEndPoint).pipe(
        catchError(e => {
          return throwError(e);
        })
      );
    }
   

  getCelulasMinisterio(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.urlEndPoint + `/ministerio`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getCelulasMinisterioReporte(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.urlEndPoint + `/reporteministerio`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public create(registro: CelulaI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<CelulaI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  getCelulaId(id: any): Observable<CelulaI> {
    const params = new HttpParams().set('id', id);
    return this.http.get<CelulaI>(`${this.urlEndPoint}/unico`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  getCelulaDiscipulos(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<MiembroCelula[]>(this.urlEndPoint + `/discipulos`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );;
  }

  public update(registro: CelulaI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<CelulaI>(`${this.urlEndPoint}`, registro).pipe(
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

  getCelulaLider(id: any): Observable<CelulaI> {
    const params = new HttpParams().set('id', id);
    return this.http.get<CelulaI>(`${this.urlEndPoint}/lider`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }


  filtrarMiembros(term: string): Observable<MiembroI[]> {
    const params = new HttpParams().set('id', term);
    return this.http.get<MiembroI[]>(`${this.urlEndPoint}/filtrar-miembros`,{params});
  }


}