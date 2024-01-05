
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AsistenciaCelula } from '../models/asistencia.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class AsistenciaCelulaService {
  
  //private urlEndPoint: string = 'http://localhost:8080/api/detalle_asistencia_celula';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/detalle_asistencia_celula';
 // private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/detalle_asistencia_celula'

  private urlEndPoint = environment.apiUrl+'/detalle_asistencia_celula';


  constructor(private http: HttpClient, private router: Router) { }

   getReporteCelula(id: any): Observable<AsistenciaCelula> {

    const params = new HttpParams().set('id', id);
    return this.http.get<AsistenciaCelula>(`${this.urlEndPoint}`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public create(registro: AsistenciaCelula) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.post<AsistenciaCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  delete(id: any): Observable<AsistenciaCelula> {   
    const params = new HttpParams().set('id', id);
    return this.http.delete<AsistenciaCelula>(`${this.urlEndPoint}`,{params}).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  
}