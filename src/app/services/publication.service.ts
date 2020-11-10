import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {GLOBAL} from './global';
import { Publication } from '../models/publication';


@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url:string;

  constructor(
    private httpClient:HttpClient
  ) { 
    this.url = GLOBAL.url;
  }

  addPublication(token:string, publication:Publication): Observable<any>{
    let params = JSON.stringify(publication);
    let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization', token);
    
        return this.httpClient.post(`${this.url}/publication`,params,{headers});
  }

  getPublications(token:string, page:number = 1):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization', token);

    return this.httpClient.get(`${this.url}/publications/${page}`, {headers});
  }


  deletePublication(token:string, id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization', token);

      return this.httpClient.delete(`${this.url}/publication/${id}`,{headers});
  }

}
