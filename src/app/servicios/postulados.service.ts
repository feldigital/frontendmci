import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PostuladoUvidaI } from '../models/postuladouvida.model';
import { MiembroI } from '../models/miembro.model';

@Injectable({
  providedIn: 'root'
})
export class PostuladosService {
  //private urlEndPoint: string = 'http://localhost:8080/api/postulados_uvida';
  private urlEndPoint: string = 'http://Backend-env.eba-acyvuvgp.us-east-1.elasticbeanstalk.com/api/postulados_uvida';

  constructor(private http: HttpClient, private router: Router) { }


  
  public postular(registro: PostuladoUvidaI) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.post<PostuladoUvidaI>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
   
  public actualizarPostulados(registro: any) {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.put<String>(this.urlEndPoint, JSON.stringify(registro), { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public despostular(id: number): Observable<void>  {   
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public existePostulado() {
    const headers = { 'Content-Type': 'application/json' };   
    return this.http.get<MiembroI>(this.urlEndPoint + '/activos', { headers }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  
}

