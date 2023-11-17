import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { EventoI } from '../models/evento.model';


@Injectable()
export class EventoService {
   //private urlEndPoint: string = 'http://localhost:8080/api/eventos';
   private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/eventos';

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
    return this.http.get<EventoI>(`${this.urlEndPoint}/${id}`).pipe(
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