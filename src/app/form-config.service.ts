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


  private formFieldsConfigSubject = new BehaviorSubject<FormFieldConfig[]>([
    { name: 'name', label: 'Name', type: 'text', show: true, required: true, order: 1 },
    { name: 'mobile', label: 'Mobile', type: 'text', show: true, required: true, order: 2 },
    { name: 'email', label: 'Email', type: 'text', show: true, required: true, order: 3 },
    { name: 'address', label: 'Address', type: 'textarea', show: true, required: false, order: 4 },
  ]);

  formFieldsConfig$: Observable<FormFieldConfig[]> = this.formFieldsConfigSubject.asObservable();

  constructor() { }

  get formFieldsConfig(): FormFieldConfig[] {
    return this.formFieldsConfigSubject.getValue();
  }

  updateConfig(config: FormFieldConfig[]): void {
    this.formFieldsConfigSubject.next([...config]);
  }

  updateFieldVisibility(field: FormFieldConfig): void {
    const currentConfig = this.formFieldsConfigSubject.getValue();
    const updatedConfig = currentConfig.map(f => {
      if (f.name === field.name) {
        if (!field.show) {
          return { ...field, required: false };
        }
        return { ...field };
      }
      return f;
    });

    this.formFieldsConfigSubject.next(updatedConfig);
  }

  updateFieldRequired(field: FormFieldConfig): void {
    const currentConfig = this.formFieldsConfigSubject.getValue();
    const updatedConfig = currentConfig.map(f =>
      f.name === field.name ? { ...field } : f
    );

    this.formFieldsConfigSubject.next(updatedConfig);
  }

  reorderFields(oldIndex: number, newIndex: number): void {
    const currentConfig = [...this.formFieldsConfigSubject.getValue()];
    const [movedItem] = currentConfig.splice(oldIndex, 1);
    currentConfig.splice(newIndex, 0, movedItem);
  
    const updatedConfig = currentConfig.map((field, index) => ({
      ...field,
      order: index + 1
    }));
  
    this.formFieldsConfigSubject.next(updatedConfig);
  }

  getSortedVisibleFields(): FormFieldConfig[] {
    return this.formFieldsConfig
      .filter(field => field.show)
      .sort((a, b) => a.order - b.order);
  }
}
