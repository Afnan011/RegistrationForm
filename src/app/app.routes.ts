import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ConfigureComponent } from './configure/configure.component';

export const routes: Routes = [

    {path:'', redirectTo:'register', pathMatch:'full'},
    {path:'register', component:FormComponent},
    {path:'configure', component:ConfigureComponent}
];
