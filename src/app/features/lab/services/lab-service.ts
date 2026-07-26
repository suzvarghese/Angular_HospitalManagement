import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.developement';

import { LabOrder } from '../models/lab-order';
import { LabTest } from '../models/lab-test';
import { LabTechnician } from '../models/lab-technician';
import { LabResult } from '../models/lab-result';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  private baseUrl = environment.apiUrl + 'Lab';

  // Once a technician marks an order Completed, the backend moves it forward
  // through BillGenerated and then Paid as billing happens (see LabController).
  // Anything in this set has finished testing and its report/bill should still
  // be visible — treating only 'Completed' as "done" makes orders disappear
  // from Reports/Billing the moment a bill is generated.
  private readonly reportReadyStatuses = ['Completed', 'BillGenerated', 'Paid'];

  isReportReady(status?: string): boolean {
    return !!status && this.reportReadyStatuses.includes(status);
  }

  constructor(private http: HttpClient) { }



  // ===============================
// Lab Tests
// ===============================

getLabTests(): Observable<LabTest[]> {
  return this.http.get<LabTest[]>(`${this.baseUrl}/tests`);
}

getLabTestById(id: number): Observable<LabTest> {
  return this.http.get<LabTest>(`${this.baseUrl}/tests/${id}`);
}

addLabTest(test: LabTest): Observable<any> {
  return this.http.post(`${this.baseUrl}/tests`, test);
}

updateLabTest(id: number, test: LabTest): Observable<any> {
  return this.http.put(`${this.baseUrl}/tests/${id}`, test);
}

deleteLabTest(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/tests/${id}`);
}

 // ===============================
// Lab Technicians
// ===============================

getLabTechnicians(): Observable<LabTechnician[]> {
  return this.http.get<LabTechnician[]>(`${this.baseUrl}/technicians`);
}

// ===============================
// Lab Orders
// ===============================

getOrders(): Observable<LabOrder[]> {
  return this.http.get<LabOrder[]>(`${this.baseUrl}/orders`);
}

getOrderById(id: number): Observable<LabOrder> {
  return this.http.get<LabOrder>(`${this.baseUrl}/orders/${id}`);
}

getOrdersByStatus(status: string): Observable<LabOrder[]> {
  return this.http.get<LabOrder[]>(`${this.baseUrl}/orders/status/${status}`);
}

getCompletedOrdersByDoctor(doctorId: number): Observable<LabOrder[]> {
  return this.http.get<LabOrder[]>(
    `${this.baseUrl}/orders/doctor/${doctorId}/completed`
  );
}
createLabOrder(
  order: {
    consultationId: number;
    testIds: number[];
  }
): Observable<any> {
  return this.http.post(`${this.baseUrl}/orders`, order);
}

updateOrderStatus(
  id: number,
  order: {
    status?: string;
    assignedTechnicianId?: number;
    sampleCollected?: boolean;
  }
): Observable<any> {
  return this.http.put(`${this.baseUrl}/orders/${id}/status`, order);
}

// ===============================
// Lab Results
// ===============================

addLabResult(
  result: {
    labOrderDetailId: number;
    resultValue?: string;
    remarks?: string;
  }
): Observable<any> {
  return this.http.post(`${this.baseUrl}/results`, result);
}

updateLabResult(
  id: number,
  result: {
    resultValue?: string;
    remarks?: string;
  }
): Observable<any> {
  return this.http.put(`${this.baseUrl}/results/${id}`, result);
}

downloadLabReport(labOrderId: number): Observable<Blob> {
  return this.http.get(
    `${this.baseUrl}/results/order/${labOrderId}/pdf`,
    { responseType: 'blob' }
  );
}

// ===============================
// Lab Bills
// ===============================

generateLabBill(
  bill: {
    labOrderId: number;
    discount: number;
  }
): Observable<any> {
  return this.http.post(`${this.baseUrl}/bills`, bill);
}

  getLabBill(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/bills/order/${orderId}`);
  }

  downloadLabBill(orderId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/bills/order/${orderId}/pdf`,
      { responseType: 'blob' }
    );
  }

  updateBillPaymentStatus(labBillId: number, paymentStatus: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/bills/${labBillId}/payment/${paymentStatus}`,
      {}
    );
  }
}