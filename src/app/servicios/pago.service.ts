import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PagoI } from '../models/pago.model';
import { environment } from 'src/environments/environment';


@Injectable()
export class PagoService {
  //private urlEndPoint: string = 'http://localhost:8080/api/pagos';
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/pagos';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/pagos';

  private urlEndPoint = environment.apiUrl+'/pagos';

  constructor(private http: HttpClient, private router: Router) { }

 
  getPagosXEvento(ideve: any): Observable<any> {
    const params = new HttpParams().set('id', ideve);
    return this.http.get(`${this.urlEndPoint}/evento`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  
  getPagosXEventoXDiscipulo(ideve: any,iddisc: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('evento', ideve);
    params = params.append('discipulo', iddisc);
    return this.http.get(`${this.urlEndPoint}/evento/discipulo`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getPagosXEventoCruzado(ideve: any): Observable<any> {
    const params = new HttpParams().set('id', ideve);
    return this.http.get(`${this.urlEndPoint}/cruzado`,{params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getPagoId(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<PagoI>(`${this.urlEndPoint}/unico`,{params}).pipe(
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