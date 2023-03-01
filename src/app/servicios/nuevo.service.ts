
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NuevoI } from '../models/nuevo.model';

@Injectable()
export class NuevoService {
  private urlEndPoint: string = 'http://localhost:8080/api/ganados';

  constructor(private http: HttpClient, private router: Router) { }


  getNuevos(id: any): Observable<NuevoI> {
    return this.http.get<NuevoI>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/nuevo']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  
  getHistorialNuevo(id: any): Observable<NuevoI> {
    return this.http.get<NuevoI>(`${this.urlEndPoint}/historial/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
         //this.router.navigate(['/nuevo']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  getNuevosTodos(): Observable<NuevoI> {
    return this.http.get<NuevoI>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/nuevo']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }


  getNuevosMinisterio(id: any): Observable<NuevoI> {
    return this.http.get<NuevoI>(`${this.urlEndPoint}/ministerio/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
         //this.router.navigate(['/nuevo']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  public create(registro: NuevoI) {
    const headers = { 'Content-Type': 'application/json' };
        return this.http.post<NuevoI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update(registro: NuevoI){
    const headers = { 'Content-Type': 'application/json' };
           return this.http.put<NuevoI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
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

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  
}