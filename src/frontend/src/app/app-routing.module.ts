import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from "./course/course.component";
import { CourseInfoComponent } from './course/course-info.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { OverviewComponent } from './overview/overview.component';
import { DocsComponent } from './docs/docs.component';


const routes: Routes = [
  {path: "", redirectTo: "course", pathMatch: "full"},
  {path: "course/:id", component: CourseComponent},
  {path: "statistics", component: StatisticsComponent},
  {path: "overview", component: OverviewComponent},
  {path: "docs", component: DocsComponent},
  {path: "**", component: CourseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
