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

export class FormComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  submittedData: any = null;
  fields: FormFieldConfig[] = [];


  constructor(
    private fb: FormBuilder,
    private formConfigService: FormConfigService
  ) {
    this.registrationForm = this.fb.group({});
  }


  ngOnInit() {
    const storedFields = this.formConfigService.getFields(); 
    this.fields = storedFields.filter(f => f.show);
 
    this.updateForm({});
   
    this.formConfigService.fields$.subscribe(fields => {
      this.fields = fields.filter(f => f.show);
      this.updateForm();
    });
  }

  updateForm(savedData: any = {}) {
    console.log("Updating Form with Fields: ", this.fields);
 
    Object.keys(this.registrationForm.controls).forEach(control => {
      this.registrationForm.removeControl(control);
    });
 
    this.fields.forEach(field => {
      if (field.show) {
        let validators = [];
        
        if (field.required) {
          validators.push(Validators.required);
          if (field.name === 'email') {
            validators.push(Validators.email);
            validators.push(Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));
          }
  
          if (field.name === 'mobile') {
            validators.push(Validators.pattern(/^[0-9]{10}$/));
          }
        }

        
        this.registrationForm.addControl(
          field.name,
          this.fb.control(savedData[field.name] || '', validators)
        );
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submitted = true;
      this.submittedData = {};

      this.fields.forEach(field => {
        this.submittedData[field.name] = this.registrationForm.get(field.name)?.value;
      });
      console.log(this.submittedData);
    } else {
      this.fields.forEach(field => {
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
    
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      
      if (control.errors['pattern']) {
        if (fieldName === 'mobile') {
          return 'Please enter a valid 10-digit phone number';
        }
        if (fieldName === 'email') {
          return 'Please enter a valid email address';
        }
      }
    }
    
    return 'Invalid input';
  }
}





