import { Routes } from '@angular/router';
import { DepartmentsComponent } from './components/departments/departments.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { SalariesComponent } from './components/salaries/salaries.component';

export const routes: Routes = [
  { path: '', component: EmployeesComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'salaries', component: SalariesComponent },
];
