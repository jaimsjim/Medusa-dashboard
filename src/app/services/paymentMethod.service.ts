import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethodModel } from '../models/paymentMethod.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private apiUrl = 'http://localhost:5133/api';

  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PaymentMethod`);
  }

  // getPaymentMethod(id: number): Observable<PaymentMethodModel> {
  //   return this.http.get<PaymentMethodModel>(`${this.apiUrl}/PaymentMethod/${id}`);
  // }

  createPaymentMethod(payment_method: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrl}/PaymentMethod`, payment_method, {
      observe: 'response',
    });
  }

  updatePaymentMethod(
    paymentMethodID: number,
    payment_method: any
  ): Observable<HttpResponse<any>> {
    return this.http.put(
      `${this.apiUrl}/PaymentMethod/${paymentMethodID}`,
      payment_method,
      {
        observe: 'response',
      }
    );
  }

  deletePaymentMethod(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.apiUrl}/PaymentMethod/${id}`, {
      observe: 'response',
    });
  }
}
