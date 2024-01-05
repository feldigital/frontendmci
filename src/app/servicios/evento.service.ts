import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { EventoI } from '../models/evento.model';
import { environment } from 'src/environments/environment';


@Injectable()
export class EventoService {
   //private urlEndPoint: string = 'http://localhost:8080/api/eventos';
   //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/eventos';
   //private urlEndPoint: string = 'http://18.212.243.217:8080/api/eventos';

   private urlEndPoint = environment.apiUrl+'/eventos';
 
  constructor(private http: HttpClient, private router: Router) { }

 
  getEventos(): Observable<any> {
    return this.http.get(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getEventosActivos(): Observable<any> { 
    return this.http.get(`${this.urlEndPoint}/activos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  getEventoID(id: any): Observable<EventoI> {
    const params = new HttpParams().set('id', id);
    return this.http.get<EventoI>(`${this.urlEndPoint}/unico`,{params}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/celula']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  } 

  public create(registro: EventoI) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.post<EventoI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: EventoI) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<EventoI>(`${this.urlEndPoint}`, registro).pipe(
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