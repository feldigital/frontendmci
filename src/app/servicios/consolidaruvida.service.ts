import { Injectable } from '@angular/core';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable()
export class ConsolidarUvidaService {
  //private urlEndPoint: string = 'http://localhost:8080/api/consolidar_uvida';
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/consolidar_uvida';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/consolidar_uvida';

  private urlEndPoint = environment.apiUrl+'/consolidar_uvida';

  constructor(private http: HttpClient, private router: Router) { }

 
  getCiclos(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getCiclosActivos(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/activa`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );   
    }
  
    getCiclosActivosMinisterio(id: any): Observable<any> {
      const params = new HttpParams().set('id', id);
      return this.http.get(`${this.urlEndPoint}/ministerio`,{params}).pipe(
        catchError(e => {
          return throwError(e);
        })
      );   
      }

  getCiclo(id: any): Observable<ConsolidarUvidaI> {
    const params = new HttpParams().set('id', id);
    return this.http.get<ConsolidarUvidaI>(`${this.urlEndPoint}/unico`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  } 

  public create(registro: ConsolidarUvidaI) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.post<ConsolidarUvidaI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: ConsolidarUvidaI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<ConsolidarUvidaI>(`${this.urlEndPoint}`, registro).pipe(
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
  
}