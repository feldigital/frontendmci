import { Injectable } from '@angular/core';
import { ConsolidarUvidaI } from 'src/app/models/consolidaruvida.model';
import { HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class ConsolidarUvidaService {
   //private urlEndPoint: string = 'http://localhost:8080/api/consolidar_uvida';
   private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/consolidar_uvida';

  constructor(private http: HttpClient, private router: Router) { }

 
  getCiclos(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getCiclosActivos(): Observable<any> {
    return this.http.get(this.urlEndPoint+ '/activa').pipe(
      catchError(e => {
        return throwError(e);
      })
    );   
    }
  
    getCiclosActivosMinisterio(id: number): Observable<any> {
      return this.http.get(`${this.urlEndPoint}/ministerio/${id}`).pipe(
        catchError(e => {
          return throwError(e);
        })
      );   
      }

  getCiclo(id: any): Observable<ConsolidarUvidaI> {
    return this.http.get<ConsolidarUvidaI>(`${this.urlEndPoint}/${id}`).pipe(
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