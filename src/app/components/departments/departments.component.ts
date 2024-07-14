import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { DepartmentModel } from '../../models/department.model';

class Departments {
  constructor(
    public department_id: number = 0,
    public department_description: string = ''
  ) {}
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [FormsModule, NgbModule, CommonModule],
  providers: [DepartmentService],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  departments: Departments[] = [];
  regModel: Departments = new Departments();
  showNew: Boolean = false;
  submitType: string = 'Save';
  selectedRow: number = -1;

  // constructor() {
  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.getDepartmentsData();
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

  // Metodo para crear un nuevo departamento
  onNew() {
    this.regModel = new Departments();
    this.submitType = 'Guardar';
    this.showNew = true;
  }

  // Metodo para guardar
  onSave() {
    if (this.submitType === 'Guardar') {
      this.departmentService
        .createDepartment(this.regModel)
        .subscribe((response) => {
          if (response.status == 201) {
            this.getDepartmentsData();
          } else {
            console.log('Error Creating Department', response);
          }
        });
    } else {
      // Update changes in employee
      this.departmentService
        .updateDepartment(this.regModel.department_id, this.regModel)
        .subscribe((response) => {
          if (response.status == 204) {
            this.getDepartmentsData();
          } else {
            console.log('Error Updating Department', response);
          }
        });
    }
    this.showNew = false;
  }

  // Metodo para editar un departamento
  onEdit(index: number) {
    this.selectedRow = index;
    this.regModel = new Departments();
    this.regModel = Object.assign({}, this.departments[this.selectedRow]);
    this.submitType = 'Actualizar';
    this.showNew = true;
  }

  // Metodo para eliminar un departamento
  onDelete(departmentId: number) {
    this.departmentService
      .deleteDepartment(departmentId)
      .subscribe((response) => {
        if (response.status == 204) {
          this.getDepartmentsData();
        }
      });
  }

  // Metodo para cancelar la accion
  onCancel() {
    this.showNew = false;
  }
}
