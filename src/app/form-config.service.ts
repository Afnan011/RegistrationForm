import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  show: boolean;
  required: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  private fields: FormFieldConfig[] =[
    { name: 'name', label: 'Name', type: 'text', show: true, required: true, order: 1 },
    { name: 'mobile', label: 'Mobile', type: 'text', show: true, required: true, order: 2 },
    { name: 'email', label: 'Email', type: 'text', show: true, required: true, order: 3 },
    { name: 'address', label: 'Address', type: 'textarea', show: true, required: false, order: 4 },
  ];

  private fieldsSubject = new BehaviorSubject<FormFieldConfig[]>(this.fields);
  fields$ = this.fieldsSubject.asObservable();

  getFields(): FormFieldConfig[] {
    return this.fields;
  }
 
  setFields(updatedFields: FormFieldConfig[]) {
    this.fields = updatedFields;
    this.fieldsSubject.next(this.fields);
  }
}
