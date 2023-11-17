import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PagoI } from '../models/pago.model';


@Injectable()
export class PagoService {
  // private urlEndPoint: string = 'http://localhost:8080/api/pagos';
   private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/pagos';

  constructor(private http: HttpClient, private router: Router) { }

 
  getPagosXEvento(ideve: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/evento/${ideve}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  
  getPagosXEventoXDiscipulo(ideve: number,iddisc: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/evento/${ideve}/discipulo/${iddisc}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getPagosXEventoCruzado(ideve: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/cruzado/${ideve}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getPagoId(id: any): Observable<any> {
    return this.http.get<PagoI>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/pagos']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  } 

  public create(registro: PagoI) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.post<PagoI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: PagoI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<PagoI>(`${this.urlEndPoint}`, registro).pipe(
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