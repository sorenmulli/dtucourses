import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ICoursesMin, ICourseMin, ICourse } from './course';
import { HttpService } from '../common/http.service';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  show: "loading" | "courses" | "course" | "error" = "loading";
  currentCourse: ICourse;
  courses: ICourseMin[];
  search: string;
  showAll: boolean = false;
  errorMsg: string;
  errorCode: string;

  coursesPerPage = 50;
  shownCourses = this.coursesPerPage;

  constructor(private commonService: CommonService, private route: ActivatedRoute,
              private router: Router, private httpService: HttpService) { }

  ngOnInit() {
    // TODO: Kom med søgeforslag, hvis kurset ikke findes
    this.httpService.getCoursesMin().then(val => {
      this.show = "courses";
      this.commonService.time = val.time;
      this.courses = val.courses;
    }).catch(reason => {
      this.show = "error";
      this.errorMsg = `Der skete en fejl ved hentningen af kurser`;
      this.errorCode = reason.statusText;
    });
  }

  setCourse(courseNo: string) {
    this.show = "loading";
    this.httpService.getCourse(courseNo).then((course) => {
      this.show = "course";
      this.currentCourse = course;
    }).catch((reason) => {
      this.errorMsg = `Der skete en fejl ved hentningen af data om kursus ${courseNo}`;
      this.errorCode = reason.statusText;
      this.show = "error";
    });
  }

  get showShowMore(): boolean {
    return this.shownCourses < this.courses.length;
  }

  showMore() {
    this.shownCourses += this.coursesPerPage;
    this.shownCourses = Math.min(this.shownCourses, this.courses.length);
  }
}
