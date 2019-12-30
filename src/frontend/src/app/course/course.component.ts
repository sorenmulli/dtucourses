import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { ICoursesMin, ICourseMin, ICourse } from './course';
import { HttpService } from '../common/http.service';
import { CommonService } from '../common/common.service';
import { FilterPipe } from './course.pipe';

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

  private coursesPerPage = 50;
  maxShown = this.coursesPerPage;
  showShowMore = false;

  constructor(private commonService: CommonService, private router: Router, private httpService: HttpService, private filterPipe: FilterPipe) { }

  ngOnInit() {

    // TODO: Kom med søgeforslag, hvis kurset ikke findes
    this.httpService.getCoursesMin().then(val => {
      this.show = "courses";
      this.commonService.time = val.time;
      this.courses = val.courses;
      this.showShowMore = this.getShownCourses() < this.courses.length;
      if (window.history.state.courseNo) {
        this.setCourse(window.history.state.courseNo);
      }
    }).catch(reason => {
      this.show = "error";
      this.errorMsg = `Der skete en fejl ved hentningen af kurser`;
      this.errorCode = reason.statusText;
    });

  }

  setCourse(courseNo: string) {
    if (courseNo === null) return;
    this.show = "loading";
    this.httpService.getCourse(courseNo).then((course) => {
      // this.router.navigateByUrl(`/${courseNo}`);
      this.show = "course";
      this.currentCourse = course;
    }).catch((reason) => {
      this.errorMsg = `Der skete en fejl ved hentningen af data om kursus ${courseNo}`;
      this.errorCode = reason.status + " " + reason.statusText;
      this.show = "error";
    });
  }

  onSearchChange(search: string) {
    // this.router.navigateByUrl("course");
    this.show = "courses";
    this.search = search;
    this.showShowMore = this.getShownCourses() < this.getListLength();
  }

  getShownCourses(): number {
    return Math.min(this.getListLength(), this.maxShown);
  }

  getListLength(): number {
    if (!this.search) return this.courses.length;
    return this.filterPipe.transform(this.courses, this.search).length;
  }

  showMore() {
    this.maxShown += this.coursesPerPage;
    this.maxShown = Math.min(this.maxShown, this.courses.length);
    this.onSearchChange(this.search);
  }

  getFirstCourse(): string {
    const filtered = this.filterPipe.transform(this.courses, this.search)
    return filtered ? filtered[0].course_no : null;
  }
}
