import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5133/api';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Employee`);
  }

  // getEmployee(id: number): Observable<EmployeeModel> {
  //   return this.http.get<EmployeeModel>(`${this.apiUrl}/${id}`);
  // }

  createEmployee(employee: any): Observable<HttpResponse<any>> {
    const startDate = new Date(
      employee.start_Date.year,
      employee.start_Date.month - 1,
      employee.start_Date.day
    );
    const DOB = new Date(
      employee.birthday.year,
      employee.birthday.month - 1,
      employee.birthday.day
    );

    const newEmployee = {
      first_Name: employee.first_Name,
      last_Name: employee.last_Name,
      start_Date: startDate.toISOString().split('T')[0],
      birthday: DOB.toISOString().split('T')[0],
      department_id: employee.department_id ? employee.department_id : 0,
    };
    return this.http.post(`${this.apiUrl}/Employee`, newEmployee, {
      observe: 'response',
    });
  }

  updateEmployee(
    employeeID: number,
    employee: any
  ): Observable<HttpResponse<any>> {
    const startDate = new Date(
      employee.start_Date.year,
      employee.start_Date.month - 1,
      employee.start_Date.day
    );
    const DOB = new Date(
      employee.birthday.year,
      employee.birthday.month - 1,
      employee.birthday.day
    );

    const updatedEmployee = {
      first_Name: employee.first_Name,
      last_Name: employee.last_Name,
      start_Date: startDate.toISOString().split('T')[0],
      birthday: DOB.toISOString().split('T')[0],
      department_id: employee.department_id ? employee.department_id : 0,
    };

    return this.http.put(
      `${this.apiUrl}/Employee/${employeeID}`,
      updatedEmployee,
      {
        observe: 'response',
      }
    );
  }

  deleteEmployee(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.apiUrl}/Employee/${id}`, {
      observe: 'response',
    });
  }
}
