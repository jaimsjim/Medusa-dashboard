import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalaryModel } from '../models/salary.model';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private apiUrl = 'http://localhost:5133/api';

  constructor(private http: HttpClient) {}

  getSalaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Salary`);
  }

  // getSalary(id: number): Observable<SalaryModel> {
  //   return this.http.get<SalaryModel>(`${this.apiUrl}/Salary/${id}`);
  // }

  createSalary(salary: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrl}/Salary`, salary, {
      observe: 'response',
    });
  }

  updateSalary(salaryID: number, salary: any): Observable<HttpResponse<any>> {
    return this.http.put(`${this.apiUrl}/Salary/${salaryID}`, salary, {
      observe: 'response',
    });
  }

  deleteSalary(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.apiUrl}/Salary/${id}`, {
      observe: 'response',
    });
  }
}
