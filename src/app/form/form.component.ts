import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormConfigService } from '../form-config.service';
import { ToastrService } from 'ngx-toastr';
import { FormFieldConfig } from '../form-field-config.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  submittedData: any = null;
  fields: FormFieldConfig[] = [];

  private maxLengths: { [key: string]: number } = {
    name: 50,
    email: 100,
    mobile: 10,
    address: 200
  };

  constructor(
    private fb: FormBuilder,
    private formConfigService: FormConfigService,
    private toastr: ToastrService
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
        }

        const maxLength = this.getMaxLength(field.name);
        validators.push(Validators.maxLength(maxLength));

        if(field.name === 'name') {
          validators.push(Validators.minLength(3));
          validators.push(Validators.pattern(/^[a-zA-Z ]+$/));
        }

        if (field.name === 'email') {
          validators.push(Validators.email);
          validators.push(Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));
        }

        if (field.name === 'mobile') {
          validators.push(Validators.pattern(/^[0-9]{10}$/));
        }


        this.registrationForm.addControl(
          field.name,
          this.fb.control(savedData[field.name] || '', validators)
        );
      }
    });
  }

  getMaxLength(fieldName: string): number {
    return this.maxLengths[fieldName] || 100; 
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const hasValues = Object.keys(this.registrationForm.controls).some(key =>
        this.registrationForm.get(key)?.value !== '' &&
        this.registrationForm.get(key)?.value !== null
      );

      if (!hasValues) {
        this.toastr.warning('Please fill in at least one field before submitting.', 'Empty Form');
        return;
      }

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

  editForm(): void {
    this.submitted = false;
  }

  confirmSubmit(): void {
    this.toastr.success('Form has been successfully submitted!', 'Success');
    this.submitted = false;
    this.registrationForm.reset();
  }

  closeDialog(): void {
    this.submitted = false;
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
      if (control.errors['minlength']) {
        return `Please enter a valid name, Minimum length is ${control.errors['minlength'].requiredLength} characters` ;
      }
      if (control.errors['maxlength']) {
        return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
      }

      if (control.errors['pattern']) {
        if (fieldName === 'mobile') {
          return 'Please enter a valid 10-digit phone number';
        }
        if (fieldName === 'email') {
          return 'Please enter a valid email address';
        }
        if (fieldName === 'name') {
          return 'Please enter a valid name';
        }
      }
    }

    return 'Invalid input';
  }
}





