import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LabTest } from '../../models/lab-test';
import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-manage-lab-tests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './manage-lab-tests.html',
  styleUrl: './manage-lab-tests.scss'
})
export class ManageLabTestsComponent implements OnInit {

  labTests = signal<LabTest[]>([]);

  constructor(
    private labService: LabService
  ) {}

  ngOnInit(): void {
    this.loadLabTests();
  }

  loadLabTests(): void {

    this.labService.getLabTests().subscribe({

      next: (data) => {

        console.log("Lab Tests:", data);
        this.labTests.set(data);

      },

      error: (err) => {

        console.error("API Error:", err);

      }

    });

  }

  deleteTest(id: number): void {

    if (confirm("Delete this lab test?")) {

      this.labService.deleteLabTest(id).subscribe({

        next: () => {

          alert("Deleted successfully");
          this.loadLabTests();

        },

        error: (err) => {

          console.log(err);

        }

      });

    }

  }

}