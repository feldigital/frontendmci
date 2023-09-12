
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AsistenciaCelula } from '../models/asistencia.model';

@Injectable()
export class AsistenciaCelulaService {
  
   //private urlEndPoint: string = 'http://localhost:8080/api/detalle_asistencia_celula';
   private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/detalle_asistencia_celula';


  constructor(private http: HttpClient, private router: Router) { }

   getReporteCelula(id: any): Observable<AsistenciaCelula> {
    return this.http.get<AsistenciaCelula>(`${this.urlEndPoint}/${id}`).pipe(
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

  delete(id: number): Observable<AsistenciaCelula> {   
    return this.http.delete<AsistenciaCelula>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  
}