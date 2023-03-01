
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MiembroCelula } from '../models/miembrocelula.model';

@Injectable()
export class MiembroCelulaService {
  private urlEndPoint: string = 'http://localhost:8080/api/celula_miembros';

  constructor(private http: HttpClient, private router: Router) { }


  getMiembrosCelula(id: any): Observable<MiembroCelula> {
    return this.http.get<MiembroCelula>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public create(registro: MiembroCelula) {
    const headers = { 'Content-Type': 'application/json' };
    console.log(JSON.stringify(registro));
    return this.http.post<MiembroCelula>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
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
  
}