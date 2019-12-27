import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import localeDA from "@angular/common/locales/da";
import { CourseComponent } from './course/course.component';
import { CourseInfoComponent } from "./course/course-info.component";
import { StatisticsComponent } from './statistics/statistics.component';
import { OverviewComponent } from './overview/overview.component';
import { DocsComponent } from './docs/docs.component';
import { FormsModule } from '@angular/forms';
import { PlotlyComponent } from './plotly/plotly.component';
import { CourseService } from './course/course.service';
import { KeysPipe, SafePipe } from './course/course.pipe';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material";

registerLocaleData(localeDA);

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    CourseInfoComponent,
    StatisticsComponent,
    OverviewComponent,
    DocsComponent,
    PlotlyComponent,
    KeysPipe,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
  ],
  providers: [
    CourseService,
    {provide: LOCALE_ID, useValue: "da"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
