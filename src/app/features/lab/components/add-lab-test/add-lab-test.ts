import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LabService } from '../../services/lab-service';

@Component({
  selector: 'app-add-lab-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-lab-test.html',
  styleUrl: './add-lab-test.scss'
})
export class AddLabTestComponent {

  labTestForm: FormGroup;
  submitted = false;   // NEW: only show validation errors after Save is clicked


  constructor(
    private fb: FormBuilder,
    private labService: LabService,
    private router: Router
  ) {

    this.labTestForm = this.fb.group({

      testCode: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ],

      testName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      department: [
        '',
        Validators.required
      ],

      category: [
        '',
        Validators.required
      ],

      sampleType: [
        '',
        Validators.required
      ],

      parameterName: [
        '',
        Validators.required
      ],

      normalRange: [
        '',
        Validators.required
      ],

      unit: [
        '',
        Validators.required
      ],

      baseFee: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      reportDurationHours: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ],

      isActive: [
        true
      ]

    });

  }


  // NEW: template calls this instead of checking .touched directly
  showError(controlName: string): boolean {
    const control = this.labTestForm.get(controlName);
    return !!control && control.invalid && (this.submitted || control.touched);
  }


  onSubmit(): void {

    this.submitted = true;   // NEW: mark submitted first

    if (this.labTestForm.invalid) {

      this.labTestForm.markAllAsTouched();

      return;

    }


    this.labService.addLabTest(this.labTestForm.value)
      .subscribe({

        next: () => {

          alert('Lab Test Added Successfully');

          this.router.navigate(['/lab/manage-tests']);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}