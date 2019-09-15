import { Component } from '@angular/core';
import { CourseService } from './course/course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private courseService: CourseService) {}
}
