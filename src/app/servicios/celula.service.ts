
import { Injectable } from '@angular/core';
import { CelulaI } from 'src/app/models/celula.model';
import { MiembroI } from 'src/app/models/miembro.model';
import { RedI } from 'src/app/models/red.model';
import { MedioI } from 'src/app/models/medio.model';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MiembroService } from './miembro.service';
import { MiembroCelula } from '../models/miembrocelula.model';

@Injectable()
export class CelulaService {
  private urlEndPoint: string = 'http://localhost:8080/api/celulas';

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

  getCelulasMinisterio(id: any): Observable<any>  {
    return this.http.get(this.urlEndPoint + `/ministerio/${id}`).pipe(
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


  getCelula(id: any): Observable<CelulaI> {
    return this.http.get<CelulaI>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  getCelulaDiscipulos(id: any): Observable<any> {   
    return this.http.get<MiembroCelula[]>(this.urlEndPoint + `/discipulos/${id}`).pipe(
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

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }


  filtrarMiembros(term: string): Observable<MiembroI[]> {
    return this.http.get<MiembroI[]>(`${this.urlEndPoint}/filtrar-miembros/${term}`);
  }

  
}