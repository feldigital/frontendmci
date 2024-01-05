
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MiembroCelula } from '../models/miembrocelula.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class MiembroCelulaService {
   //private urlEndPoint: string = 'http://localhost:8080/api/celula_miembros';
   //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/celula_miembros';
   //private urlEndPoint: string = 'http://18.212.243.217:8080/api/celula_miembros';

   private urlEndPoint = environment.apiUrl+'/celula_miembros';
 
  constructor(private http: HttpClient, private router: Router) { }


  getMiembrosCelula(id: any): Observable<MiembroCelula> {
    const params = new HttpParams().set('id', id);
    return this.http.get<MiembroCelula>(`${this.urlEndPoint}`,{params}).pipe(
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
  
}