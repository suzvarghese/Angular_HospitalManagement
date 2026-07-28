import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { LabTest } from '../../models/lab-test';
import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-lab-test-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './lab-test-list.html',
  styleUrl: './lab-test-list.scss'
})
export class LabTestList implements OnInit {

  // Store lab tests
  labTests = signal<LabTest[]>([]);

  // Search
  searchTerm = signal('');

  // Loading
  isLoading = signal<boolean>(true);

  // Message
  message = signal<string>('');
  messageType = signal<'success' | 'error' | ''>('');

  constructor(
    private labService: LabService
  ) {}


  ngOnInit(): void {
    this.loadLabTests();
  }


  // ===============================
  // Load Lab Tests
  // ===============================

  loadLabTests(): void {

    this.isLoading.set(true);

    this.labService.getLabTests()
      .subscribe({

        next: (tests) => {

          this.labTests.set(tests);

          this.isLoading.set(false);

        },

        error: () => {

          this.showMessage(
            'Could not load lab tests.',
            'error'
          );

          this.isLoading.set(false);

        }

      });
  }



  // ===============================
  // Search Filter
  // ===============================

  filteredTests = computed(() => {

    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.labTests();
    }

    return this.labTests().filter(test =>

      test.testName
        .toLowerCase()
        .includes(term)

      ||

      test.testCode
        .toLowerCase()
        .includes(term)

      ||

      (test.department ?? '')
        .toLowerCase()
        .includes(term)

    );

  });



  // ===============================
  // Delete Lab Test
  // ===============================

  deleteTest(test: LabTest): void {


    if(!confirm(
      `Delete "${test.testName}"?`
    ))
    {
      return;
    }


    this.labService
      .deleteLabTest(test.testId)
      .subscribe({

        next: () => {

          this.showMessage(
            'Lab test deleted successfully.',
            'success'
          );

          this.loadLabTests();

        },


        error: () => {

          this.showMessage(
            'Failed to delete lab test.',
            'error'
          );

        }

      });

  }



  // ===============================
  // Message
  // ===============================

  private showMessage(
    msg:string,
    type:'success' | 'error'
  ):void {


    this.message.set(msg);

    this.messageType.set(type);


    setTimeout(() => {

      this.message.set('');

    },4000);

  }

}