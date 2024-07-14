import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentModel } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5133/api';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Department`);
  }

  // getDepartment(id: number): Observable<DepartmentModel> {
  //   return this.http.get<DepartmentModel>(`${this.apiUrl}/${id}`);
  // }

  createDepartment(department: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrl}/Department`, department, {
      observe: 'response',
    });
  }

  updateDepartment(
    departmentID: number,
    department: any
  ): Observable<HttpResponse<any>> {
    return this.http.put(
      `${this.apiUrl}/Department/${departmentID}`,
      department,
      {
        observe: 'response',
      }
    );
  }

  deleteDepartment(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.apiUrl}/Department/${id}`, {
      observe: 'response',
    });
  }
}
