import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormConfigService, FormFieldConfig } from '../form-config.service';
import { FormsModule } from '@angular/forms';
import { GridModule, RowReorderEvent } from '@progress/kendo-angular-grid';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { Router } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ToastrService } from 'ngx-toastr';

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
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent {
  formFieldsConfig: FormFieldConfig[] = [];

  constructor(
    private formConfigService: FormConfigService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.formFieldsConfig = this.formConfigService.getFields();
    console.log('Initial formFieldsConfig:', this.formFieldsConfig);
  }

  onDragEnd(event: any) {
    const { oldIndex, newIndex } = event;
    if (oldIndex !== newIndex) {
      const movedField = this.formFieldsConfig.splice(oldIndex, 1)[0];
      this.formFieldsConfig.splice(newIndex, 0, movedField);
    }
  }

  saveConfig() {
    const hasSelectedFields = this.formFieldsConfig.some(field => field.show);

    if (!hasSelectedFields) {
      this.toastr.error('Please select at least one field to show', 'Validation Error');
      return;
    }

    console.log('Saving Config: ', this.formFieldsConfig);
    this.formConfigService.setFields(this.formFieldsConfig);
    this.router.navigate(['/register']);
  }
}
