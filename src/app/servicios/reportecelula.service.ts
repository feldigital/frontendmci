
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReporteCelula } from '../models/reportecelula.model';
import { AsistenciaCelula } from '../models/asistencia.model';

@Injectable()
export class ReporteCelulaService {
  private urlEndPoint: string = 'http://localhost:8080/api/asistencia_celula';

  constructor(private http: HttpClient, private router: Router) { }

  getReporteCelula(id: any): Observable<ReporteCelula> {
    return this.http.get<ReporteCelula>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  getOfrendaCelula(): Observable<ReporteCelula> {
    return this.http.get<ReporteCelula>(`${this.urlEndPoint}/todas`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public create(registro: ReporteCelula) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<ReporteCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: ReporteCelula){
    const headers = { 'Content-Type': 'application/json' };    
      return this.http.put<ReporteCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
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

  public llenarAsistencia(registro: AsistenciaCelula) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<AsistenciaCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}