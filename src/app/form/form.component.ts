import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckBoxModule, FormFieldModule, InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormConfigService, FormFieldConfig } from '../form-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputsModule,
    LabelModule,
    DialogModule,
    GridModule,
    CheckBoxModule,
    FormFieldModule,
    LayoutModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  submitted = false;
  submittedData: any = null;
  sortedVisibleFields: FormFieldConfig[] = [];

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private formConfigService: FormConfigService
  ) {}

  ngOnInit(): void {
    this.createForm();

    // Subscribe to changes in form configuration
    this.subscription.add(
      this.formConfigService.formFieldsConfig$.subscribe(() => {
        this.updateFormValidators();
        this.sortedVisibleFields = this.formConfigService.getSortedVisibleFields();
      })
    );

    // Initialize sortedVisibleFields
    this.sortedVisibleFields = this.formConfigService.getSortedVisibleFields();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm(): void {
    const formControls: { [key: string]: any } = {};

    this.formConfigService.formFieldsConfig.forEach(field => {
      formControls[field.name] = ['', field.required ? Validators.required : []];
    });

    this.registrationForm = this.fb.group(formControls);
    this.updateFormValidators();
  }

  updateFormValidators(): void {
    this.formConfigService.formFieldsConfig.forEach(field => {
      const control = this.registrationForm.get(field.name);
      if (control) {
        if (field.show && field.required) {
          control.setValidators(Validators.required);
        } else {
          control.setValidators(null);
        }
        control.updateValueAndValidity();
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submitted = true;
      this.submittedData = {};

      // Only include visible fields in the submitted data
      this.sortedVisibleFields.forEach(field => {
        this.submittedData[field.name] = this.registrationForm.get(field.name)?.value;
      });
    } else {
      // Mark all visible fields as touched to show validation errors
      this.sortedVisibleFields.forEach(field => {
        const control = this.registrationForm.get(field.name);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  closeDialog(): void {
    this.submitted = false;
    this.registrationForm.reset();
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control?.errors?.['required']) {
      return 'This field is required';
    }
    return 'Invalid input';
  }
}





