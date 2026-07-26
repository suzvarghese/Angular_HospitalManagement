import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LabTest } from '../../models/lab-test';
import { LabService } from '../../services/lab-service';


@Component({
  selector: 'app-edit-lab-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-lab-test.html',
  styleUrl: './edit-lab-test.scss'
})
export class EditLabTestComponent implements OnInit {


  testId!: number;


  labTest: LabTest = {

    testId: 0,
    testCode: '',
    testName: '',
    department: '',
    category: '',
    sampleType: '',
    parameterName: '',
    normalRange: '',
    unit: '',
    baseFee: 0,
    reportDurationHours: 24,
    description: '',
    isActive: true

  };



  constructor(
    private route: ActivatedRoute,
    private labService: LabService,
    private router: Router
  ) {}



  ngOnInit(): void {

    this.testId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.loadLabTest();

  }



  loadLabTest(): void {

  this.labService
    .getLabTestById(this.testId)
    .subscribe({

      next: (data) => {

        console.log("Loaded Lab Test:", data);

        this.labTest = data;

      },

      error: (err) => {

        console.error(err);

        alert('Failed to load lab test');

      }

    });

}



  updateLabTest(): void {


    this.labService
      .updateLabTest(
        this.testId,
        this.labTest
      )
      .subscribe({

        next: () => {

          alert(
            'Lab test updated successfully'
          );


          this.router.navigate([
            '/lab/manage-tests'
          ]);

        },


        error: (err) => {

          console.error(err);

          alert(
            'Failed to update lab test'
          );

        }

      });


  }




  cancel(): void {

    this.router.navigate([
      '/lab/manage-tests'
    ]);

  }


}