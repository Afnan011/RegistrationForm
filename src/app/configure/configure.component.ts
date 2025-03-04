import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormConfigService, FormFieldConfig } from '../form-config.service';
import { FormsModule } from '@angular/forms';
import { GridModule, RowReorderEvent } from '@progress/kendo-angular-grid';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { Router } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    CheckBoxModule,
    ButtonsModule
  ],
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  providers: []
})
export class ConfigureComponent implements OnInit {
  formFieldsConfig: FormFieldConfig[] = [];
  tempChanges: Map<number, { show?: boolean, required?: boolean }> = new Map();

  constructor(private formConfigService: FormConfigService, private router: Router) {}

  ngOnInit(): void {
    this.formFieldsConfig = [...this.formConfigService.formFieldsConfig];
    console.log('Initial formFieldsConfig:', this.formFieldsConfig);
  }

  onReorder(event: RowReorderEvent): void {
    console.log('RowReorderEvent:', event);
    
    const start = event.draggedRows[0]?.rowIndex;
    const end = event.dropTargetRow?.rowIndex;
    
    if (
      start !== undefined && end !== undefined &&
      start >= 0 && start < this.formFieldsConfig.length &&
      end >= 0 && end < this.formFieldsConfig.length
    ) {
      const item = this.formFieldsConfig.splice(start, 1)[0];
      this.formFieldsConfig.splice(end, 0, item);
      this.formConfigService.reorderFields(start, end);
    }
    
    console.log('Reordered formFieldsConfig:', this.formFieldsConfig);
  }

  updateFieldVisibility(field: FormFieldConfig, index: number): void {
    if (!this.tempChanges.has(index)) {
      this.tempChanges.set(index, {});
    }
    this.tempChanges.get(index)!.show = field.show;
    
    // If hiding a field, also uncheck required
    if (!field.show) {
      field.required = false;
      this.tempChanges.get(index)!.required = false;
    }
    
    console.log('Field visibility changed:', field);
  }

  updateFieldRequired(field: FormFieldConfig, index: number): void {
    if (!this.tempChanges.has(index)) {
      this.tempChanges.set(index, {});
    }
    this.tempChanges.get(index)!.required = field.required;
    console.log('Field required changed:', field);
  }

  saveChanges(): void {
    this.tempChanges.forEach((changes, index) => {
      const field = this.formFieldsConfig[index];
      
      if (changes.show !== undefined) {
        this.formConfigService.updateFieldVisibility(field);
      }
      if (changes.required !== undefined) {
        this.formConfigService.updateFieldRequired(field);
      }
    });

    // Update local array with latest from service
    this.formFieldsConfig = [...this.formConfigService.formFieldsConfig];
    
    this.tempChanges.clear();
    console.log('Saved configuration:', this.formFieldsConfig);
    this.router.navigate(['/register']);
  }
}