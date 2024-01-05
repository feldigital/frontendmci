import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PostuladoUvidaI } from '../models/postuladouvida.model';
import { MiembroI } from '../models/miembro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostuladosService {
  //private urlEndPoint: string = 'http://localhost:8080/api/postulados_uvida';
  //private urlEndPoint: string = 'https://d1imuac6pxhb6q.cloudfront.net/api/postulados_uvida';
  //private urlEndPoint: string = 'http://18.212.243.217:8080/api/postulados_uvida';

  private urlEndPoint = environment.apiUrl+'/postulados_uvida';

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

  public despostular(id: any): Observable<void>  {   
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.urlEndPoint}`,{params}).pipe(
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

