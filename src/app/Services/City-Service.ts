import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppError } from '../error-handle/app-error';
import { CityModel } from '../models/City-Model';

@Injectable()
export class CityService {
  // CityList array
  cityList: CityModel[]= [];
  // city list API
  private apiURL = 'http://localhost:3000/CityList';

  // initializing the City List array in constructor
  constructor(private http: Http) {}

   // returns the city list
  getCityList(): Observable<CityModel[]> {
    return this.http
      .get(this.apiURL)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  // error handling
  private handleError(error: Response) {
    return Observable.throw(new AppError(error));
  }
}
