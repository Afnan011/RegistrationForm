import { Component, OnInit } from '@angular/core';
import { FormConfigService } from '../form-config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormFieldConfig } from '../form-field-config.model';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {
  formFieldsConfig: FormFieldConfig[] = [];

  constructor(
    private formConfigService: FormConfigService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formFieldsConfig = this.formConfigService.getFields();
    console.log('Loaded formFieldsConfig from service:', this.formFieldsConfig);
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
    this.toastr.success('Configuration saved successfully', 'Success');
    this.router.navigate(['/register']);
  }
}
