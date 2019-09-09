import { Component, OnInit, Input } from '@angular/core';

import { ICourse, BgColours } from './course';


@Component({
  selector: 'course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {

  showCourseDescription: boolean = false;
  showStudieplan: boolean = false

  @Input() course: ICourse;
  @Input() bgColours: BgColours;

  constructor() { }

  ngOnInit() {
  }

}
