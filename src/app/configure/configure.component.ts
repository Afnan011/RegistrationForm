import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormConfigService, FormFieldConfig } from '../form-config.service';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    CheckBoxModule
  ],
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {
  formFieldsConfig: FormFieldConfig[] = [];
  tempChanges: Map<number, { show?: boolean, required?: boolean }> = new Map();

  constructor(private formConfigService: FormConfigService) {}

  ngOnInit(): void {
    this.formFieldsConfig = this.formConfigService.formFieldsConfig;
  }

  // onReorder(event: any): void {
  //   this.formConfigService.reorderFields(event.oldIndex, event.newIndex);
  // }

  updateFieldVisibility(field: FormFieldConfig, index: number): void {
    if (!this.tempChanges.has(index)) {
      this.tempChanges.set(index, {});
    }
    this.tempChanges.get(index)!.show = field.show;
  }

  updateFieldRequired(field: FormFieldConfig, index: number): void {
    if (!this.tempChanges.has(index)) {
      this.tempChanges.set(index, {});
    }
    this.tempChanges.get(index)!.required = field.required;
  }

  saveChanges(): void {
    console.log('clicked');
    this.tempChanges.forEach((changes, index) => {
      const field = this.formFieldsConfig[index];
      console.log(field);
      console.log(changes);
      
      if (changes.show !== undefined) {
        this.formConfigService.updateFieldVisibility(field);
      }
      if (changes.required !== undefined) {
        this.formConfigService.updateFieldRequired(field);
      }

      this.formFieldsConfig = this.formConfigService.formFieldsConfig;
      console.log(this.formFieldsConfig);
    });

    this.tempChanges.clear();
  }
}
