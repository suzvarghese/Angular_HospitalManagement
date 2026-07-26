import { Component, OnInit, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LabTest } from '../../models/lab-test';
import { LabService } from '../../services/lab-service';

type ModalView = 'list' | 'form';

@Component({
  selector: 'app-lab-tests-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lab-tests-modal.html',
  styleUrl: './lab-tests-modal.scss'
})
export class LabTestsModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  view = signal<ModalView>('list');

  labTests = signal<LabTest[]>([]);
  searchTerm = signal('');
  isLoading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | ''>('');

  // form state — blank object doubles as "add" until editingId is set
  editingId = signal<number | null>(null);
  form = signal<Partial<LabTest>>(this.blankForm());

  filteredTests = computed(() => {

    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.labTests();
    }

    return this.labTests().filter(test =>
      test.testName.toLowerCase().includes(term) ||
      test.testCode.toLowerCase().includes(term) ||
      (test.department ?? '').toLowerCase().includes(term)
    );

  });

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.loadLabTests();
  }

  blankForm(): Partial<LabTest> {
    return {
      testCode: '',
      testName: '',
      department: '',
      category: '',
      sampleType: '',
      parameterName: '',
      normalRange: '',
      unit: '',
      baseFee: 0,
      reportDurationHours: 1,
      description: '',
      isActive: true
    };
  }

  loadLabTests(): void {

    this.isLoading.set(true);

    this.labService.getLabTests().subscribe({

      next: (tests) => {
        this.labTests.set(tests);
        this.isLoading.set(false);
      },

      error: () => {
        this.showMessage('Could not load lab tests.', 'error');
        this.isLoading.set(false);
      }

    });

  }

  updateField(field: keyof LabTest, value: any): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  openAddForm(): void {
    this.editingId.set(null);
    this.form.set(this.blankForm());
    this.view.set('form');
  }

  openEditForm(test: LabTest): void {
    this.editingId.set(test.testId);
    this.form.set({ ...test });
    this.view.set('form');
  }

  backToList(): void {
    this.view.set('list');
  }

  saveTest(): void {

    const data = this.form();

    if (!data.testCode || !data.testName) {
      this.showMessage('Test code and name are required.', 'error');
      return;
    }

    const editingId = this.editingId();

    if (editingId) {

      this.labService.updateLabTest(editingId, data as LabTest).subscribe({

        next: () => {
          this.showMessage('Test updated successfully.', 'success');
          this.loadLabTests();
          this.view.set('list');
        },

        error: () => this.showMessage('Failed to update test.', 'error')

      });

    } else {

      this.labService.addLabTest(data as LabTest).subscribe({

        next: () => {
          this.showMessage('Test added successfully.', 'success');
          this.loadLabTests();
          this.view.set('list');
        },

        error: () => this.showMessage('Failed to add test.', 'error')

      });

    }

  }

  deleteTest(test: LabTest): void {

    if (!confirm(`Delete "${test.testName}"?`)) {
      return;
    }

    this.labService.deleteLabTest(test.testId).subscribe({

      next: () => {
        this.showMessage('Lab test deleted successfully.', 'success');
        this.loadLabTests();
      },

      error: () => this.showMessage('Failed to delete lab test.', 'error')

    });

  }

  closeModal(): void {
    this.close.emit();
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message.set(msg);
    this.messageType.set(type);
    setTimeout(() => this.message.set(''), 4000);
  }

}
