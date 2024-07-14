import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';
import { DepartmentService } from '../../services/department.service';
import { DepartmentModel } from '../../models/department.model';

class Departments {
  constructor(
    public department_id: number = 0,
    public department_description: string = ''
  ) {}
}

class Employees {
  constructor(
    public employee_id: number = 0,
    public first_Name: string = '',
    public last_Name: string = '',
    public start_Date: NgbDateStruct = { year: 0, month: 0, day: 0 },
    public birthday: NgbDateStruct = { year: 0, month: 0, day: 0 },
    public department_id?: number
  ) {}
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, NgbModule, CommonModule],
  providers: [EmployeeService, DepartmentService],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  employees: Employees[] = [];
  regModel: Employees = new Employees();
  showNew: Boolean = false;
  submitType: string = 'Save';
  selectedRow: number = -1;
  departments: Departments[] = [];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.getDepartmentsData();
    this.getEmployeesData();
  }

  getEmployeesData() {
    this.employeeService
      .getEmployees()
      .subscribe((employees: EmployeeModel[]) => {
        this.employees = employees.map((employee) => {
          const startDate = new Date(employee.start_Date);
          const birthday = new Date(employee.birthday);
          return new Employees(
            employee.employee_id,
            employee.first_Name,
            employee.last_Name,
            {
              year: startDate.getFullYear(),
              month: startDate.getMonth() + 1,
              day: startDate.getDate(),
            },
            {
              year: birthday.getFullYear(),
              month: birthday.getMonth() + 1,
              day: birthday.getDate(),
            },
            employee.department_id
          );
        });
      });
  }

  getDepartmentsData() {
    this.departmentService
      .getDepartments()
      .subscribe((departments: DepartmentModel[]) => {
        this.departments = departments.map((department) => {
          return new Departments(
            department.department_id,
            department.department_description
          );
        });
      });
  }

  // Method to find the correct Department
  public getDepartmentDescription(departmentId: number | undefined): string {
    if (!departmentId) {
      return 'N/A';
    }
    const department = this.departments.find(
      (department) => department.department_id === departmentId
    );
    return department?.department_id
      ? department.department_description
      : 'Seleccionar Departamento';
  }

  // Metodo para crear un nuevo empleado
  onNew() {
    this.regModel = new Employees();
    this.submitType = 'Guardar';
    this.showNew = true;
  }

  // Metodo para guardar
  onSave() {
    if (this.submitType === 'Guardar') {
      this.employeeService
        .createEmployee(this.regModel)
        .subscribe((response) => {
          if (response.status == 201) {
            this.getEmployeesData();
          } else {
            console.log('Error Creating Employee', response);
          }
        });
    } else {
      // Update changes in employee
      this.employeeService
        .updateEmployee(this.regModel.employee_id, this.regModel)
        .subscribe((response) => {
          if (response.status == 204) {
            this.getEmployeesData();
          } else {
            console.log('Error Updating Employee', response);
          }
        });
    }
    this.showNew = false;
  }

  // Metodo para editar un empleado
  onEdit(index: number) {
    this.selectedRow = index;
    this.regModel = new Employees();
    this.regModel = Object.assign({}, this.employees[this.selectedRow]);
    this.submitType = 'Actualizar';
    this.showNew = true;
  }

  // Metodo para eliminar un empleado
  onDelete(employeeId: number) {
    this.employeeService.deleteEmployee(employeeId).subscribe((response) => {
      if (response.status == 204) {
        this.getEmployeesData();
      }
    });
  }

  // Metodo para cancelar la accion
  onCancel() {
    this.showNew = false;
  }

  // Metodo para llenar los diferentes departamentos
  onChangeDepartment(department: number) {
    // Assign corresponding selected country to model.
    this.regModel.department_id = department;
  }
}
