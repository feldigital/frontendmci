
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReporteCelula } from '../models/reportecelula.model';
import { AsistenciaCelula } from '../models/asistencia.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReporteCelulaService {
  
  //private urlEndPoint: string = 'http://localhost:8080/api/asistencia_celula';
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/asistencia_celula';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/asistencia_celula';

  private urlEndPoint = environment.apiUrl+'/asistencia_celula';

  
  constructor(private http: HttpClient, private router: Router) { }

  getTemasIdCelula(id: any): Observable<ReporteCelula> {
    const params = new HttpParams().set('id', id);
    return this.http.get<ReporteCelula>(`${this.urlEndPoint}/celula`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  getReporteIdRealizacion(id: any): Observable<ReporteCelula> {
    const params = new HttpParams().set('id', id);
    return this.http.get<ReporteCelula>(`${this.urlEndPoint}/tema`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  getTemas(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  getTemasMinisterio(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.urlEndPoint}/ministerio`,{params}).pipe(
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

  public llenarAsistencia(registro: AsistenciaCelula) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<AsistenciaCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}