import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FormFieldConfig } from './form-field-config.model';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  private readonly STORAGE_KEY = 'formFieldsConfig';

  private defaultFields: FormFieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', show: true, required: true, order: 1 },
    { name: 'mobile', label: 'Mobile', type: 'text', show: true, required: true, order: 2 },
    { name: 'email', label: 'Email', type: 'text', show: true, required: true, order: 3 },
    { name: 'address', label: 'Address', type: 'textarea', show: true, required: false, order: 4 },
  ];

  private fields: FormFieldConfig[] = this.loadFromLocalStorage();
  private fieldsSubject = new BehaviorSubject<FormFieldConfig[]>(this.fields);
  fields$ = this.fieldsSubject.asObservable();

  constructor() {
    if (this.fields.length === 0) {
      this.fields = this.defaultFields;
      this.saveToLocalStorage();
    }
  }

  getFields(): FormFieldConfig[] {
    return this.fields;
  }

  setFields(updatedFields: FormFieldConfig[]) {
    this.fields = updatedFields;
    this.fieldsSubject.next(this.fields);
    this.saveToLocalStorage();
  }

  private loadFromLocalStorage(): FormFieldConfig[] {
    try {
      const savedConfig = localStorage.getItem(this.STORAGE_KEY);
      return savedConfig ? JSON.parse(savedConfig) : this.defaultFields;
    } catch (error) {
      console.error('Error loading form configuration from localStorage:', error);
      return this.defaultFields;
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.fields));
    } catch (error) {
      console.error('Error saving form configuration to localStorage:', error);
    }
  }
}
