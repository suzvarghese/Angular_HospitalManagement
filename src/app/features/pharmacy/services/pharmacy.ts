import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryItem,
  InventoryCreate,
  InventoryUpdate,
  InventoryRestock,
} from '../models/inventory';
import { Prescription, DispenseBatch, DispenseResponse ,PrescriptionQueueItem} from '../models/prescription';
import {
  PharmacyBillLine,
  ConsultationInvoice,
  PayBillRequest,
  PayResponse,
  PharmacyDashboardStats,
} from '../models/billing';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Pharmacy {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/pharmacy`;

  // ---------- Inventory ----------

  getAllInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.base}/inventory`);
  }

  getInventoryById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.base}/inventory/${id}`);
  }

  getLowStock(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.base}/inventory/low-stock`);
  }

  getExpiringSoon(days = 30): Observable<InventoryItem[]> {
    const params = new HttpParams().set('days', days);
    return this.http.get<InventoryItem[]>(`${this.base}/inventory/expiring-soon`, { params });
  }

  getExpired(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.base}/inventory/expired`);
  }

  addInventory(dto: InventoryCreate): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.base}/inventory`, dto);
  }

  updateInventory(id: number, dto: InventoryUpdate): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/inventory/${id}`, dto);
  }

  restock(id: number, dto: InventoryRestock): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/inventory/${id}/restock`, dto);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/inventory/${id}`);
  }

  // ---------- Prescription / Dispensing ----------

  getPrescriptionQueue(pendingOnly = true): Observable<PrescriptionQueueItem[]> {
  const params = new HttpParams().set('pendingOnly', pendingOnly);
  return this.http.get<PrescriptionQueueItem[]>(`${this.base}/prescriptions`, { params });
}

  getPrescription(consultationId: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.base}/prescriptions/${consultationId}`);
  }

  dispenseMedicines(dto: DispenseBatch): Observable<DispenseResponse> {
    return this.http.post<DispenseResponse>(`${this.base}/dispense`, dto);
  }

  // ---------- Billing ----------

  getAllBills(status?: string): Observable<PharmacyBillLine[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<PharmacyBillLine[]>(`${this.base}/bills`, { params });
  }

  getInvoiceByConsultation(consultationId: number): Observable<ConsultationInvoice> {
    return this.http.get<ConsultationInvoice>(`${this.base}/bills/consultation/${consultationId}`);
  }

  payBill(billId: number, dto: PayBillRequest): Observable<PayResponse> {
    return this.http.post<PayResponse>(`${this.base}/bills/${billId}/pay`, dto);
  }

  payConsultationBills(consultationId: number, dto: PayBillRequest): Observable<PayResponse> {
    return this.http.post<PayResponse>(`${this.base}/bills/consultation/${consultationId}/pay`, dto);
  }

  // ---------- Dashboard ----------

  getDashboard(): Observable<PharmacyDashboardStats> {
    return this.http.get<PharmacyDashboardStats>(`${this.base}/dashboard`);
  }
}
