import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ConfigureComponent } from './configure/configure.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: FormComponent, title: 'Register' },
  { path: 'configure', component: ConfigureComponent, title: 'Configure' },
  {path: '**', component: PageNotFoundComponent, title: 'Registration Form' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
