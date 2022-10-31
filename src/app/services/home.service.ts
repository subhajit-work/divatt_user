import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable()
export class HomeService {




    constructor(private http: HttpClient) { }

    getCategoriesforCarousel():Observable<any> {
        return this.http.get('http://65.1.190.195:15001/v1/category/allCatagory')
        
    }

   
}