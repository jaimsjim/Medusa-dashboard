import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { SalaryService } from '../../services/salary.service';
import { SalaryModel } from '../../models/salary.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';
import { PaymentMethodService } from '../../services/paymentMethod.service';
import { PaymentMethodModel } from '../../models/paymentMethod.model';

class Salaries {
  constructor(
    public salary_id: number = 0,
    public employee_id: number = 0,
    public monthly_salary: number = 0,
    public payment_method_id: number = 0
  ) {}
}

class PaymentMethods {
  constructor(
    public payment_method_id: number = 0,
    public payment_method_name: string = ''
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
  selector: 'app-salaries',
  standalone: true,
  imports: [FormsModule, NgbModule, CommonModule],
  providers: [SalaryService, EmployeeService, PaymentMethodService],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.css',
})
export class SalariesComponent implements OnInit {
  salaries: Salaries[] = [];
  regModel: Salaries = new Salaries();
  showNew: Boolean = false;
  submitType: string = 'Save';
  selectedRow: number = -1;
  paymentMethods: PaymentMethods[] = [];
  employees: Employees[] = [];
  sortEmployees: Employees[] = [];
  isEdit: Boolean = false;

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.getPaymentMethodsData();
    this.getEmployeesData();
    this.getSalariesData();
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

  getPaymentMethodsData() {
    this.paymentMethodService
      .getPaymentMethods()
      .subscribe((payment_methods: PaymentMethodModel[]) => {
        this.paymentMethods = payment_methods.map((payment_method) => {
          return new PaymentMethods(
            payment_method.payment_method_id,
            payment_method.payment_method_name
          );
        });
      });
  }

  getSalariesData() {
    this.salaryService.getSalaries().subscribe((salaries: SalaryModel[]) => {
      this.salaries = salaries.map((salary) => {
        return new Salaries(
          salary.salary_id,
          salary.employee_id,
          salary.monthly_salary,
          salary.payment_method_id
        );
      });
    });
  }

  // Sort Employees with an unassigned salary
  sortEmployeesData() {
    this.sortEmployees = this.employees.filter((employee) => {
      return this.salaries.every((salary) => {
        return salary.employee_id !== employee.employee_id;
      });
    });
    console.log('sortEmployees.length <= 0', this.sortEmployees.length <= 0);
  }

  // Metodo para crear un nuevo salario
  onNew() {
    this.regModel = new Salaries();
    this.submitType = 'Guardar';
    this.showNew = true;
    this.isEdit = false;
    this.sortEmployeesData();
  }

  // Metodo para guardar
  onSave() {
    if (this.submitType === 'Guardar') {
      this.salaryService.createSalary(this.regModel).subscribe((response) => {
        if (response.status == 201) {
          this.getSalariesData();
        } else {
          console.log('Error Creating Salary', response);
        }
      });
    } else {
      // Update changes in salary
      this.salaryService
        .updateSalary(this.regModel.salary_id, this.regModel)
        .subscribe((response) => {
          if (response.status == 204) {
            this.getSalariesData();
          } else {
            console.log('Error Updating Salary', response);
          }
        });
    }
    this.showNew = false;
    this.isEdit = false;
  }

  // Metodo para editar un salario
  onEdit(index: number) {
    this.selectedRow = index;
    this.regModel = new Salaries();
    this.regModel = Object.assign({}, this.salaries[this.selectedRow]);
    this.submitType = 'Actualizar';
    this.showNew = true;
    this.isEdit = true;
  }

  // Metodo para eliminar un salario
  onDelete(salaryId: number) {
    this.salaryService.deleteSalary(salaryId).subscribe((response) => {
      if (response.status == 204) {
        this.getSalariesData();
      }
    });
  }

  // Metodo para cancelar la accion
  onCancel() {
    this.showNew = false;
  }

  getMonthlyNumber(salary: number) {
    const moneyFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return moneyFormat.format(salary);
  }

  // Method to find the correct Employee Name
  getEmployeeName(employeeId: number | undefined): string {
    const employee = this.employees.find(
      (employee) => employee.employee_id === employeeId
    );
    return employee?.employee_id
      ? `${employee.first_Name} ${employee.last_Name}`
      : 'Seleccionar Empleado';
  }

  // Method to find the correct Payment Method Name
  getPaymentMethodName(paymentMethodId: number | undefined): string {
    const paymentMethod = this.paymentMethods.find(
      (paymentMethod) => paymentMethod.payment_method_id === paymentMethodId
    );
    return paymentMethod?.payment_method_id
      ? paymentMethod.payment_method_name
      : 'Seleccionar Método de Pago';
  }

  onChangeEmployee(employee: number) {
    this.regModel.employee_id = employee;
  }

  onChangePaymentMethod(paymentMethod: number) {
    this.regModel.payment_method_id = paymentMethod;
  }
}
