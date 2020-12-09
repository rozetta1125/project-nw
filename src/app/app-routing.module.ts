import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseStudyComponent } from './case-study/case-study.component';
import { WelcomeComponent } from './welcome/welcome.component'

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'casestudy', component: CaseStudyComponent },
  { path: '**', pathMatch: 'full', component: WelcomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
