import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ICoursesMin, ICourseMin } from "./course";
import { CourseService } from './course.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  show: "loading" | "courses" | "error";
  courseSearchForm: FormGroup;
  courses: ICourseMin[];
  search: string;
  showAll: boolean = false;
  errorMsg: string;
  errorCode: string;

  constructor(public courseService: CourseService, private route: ActivatedRoute,
              private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // TODO: Kom med søgeforslag, hvis kurset ikke findes
    this.getCoursesMin().then(val => {
      this.show = "courses";
      this.courseService.time = val.time;
      this.courses = val.courses;
    }).catch(reason => {
      this.show = "error";
      this.errorMsg = `Der skete en fejl ved hentningen af kurser`;
      this.errorCode = reason.statusText;
    })
    // this.courseService.loadData();
    this.courseSearchForm = new FormGroup({
      searchBar: new FormControl(sessionStorage.getItem("queue"))
    });

    this.route.params.subscribe(params => {
      this.courseService.set(params.id);
    });
  }

  getCoursesMin(): Promise<ICoursesMin> {
    return this.http.get<ICoursesMin>("https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/course_min.json").toPromise();
  }

  setCourse(courseNo: string) {
    this.router.navigate([""]).then(
      () => this.router.navigate(["course", courseNo])
    );
  }

  setTopCourse() {
    // Tager kurset øverst i søgningen
    // const courseNo = Object.keys(this.searchResults).sort()[0];
    // Sikrer, at siden genindlæses, selv hvis kurset, og dermed url'en, er den samme
    // this.setCourse(courseNo);
  }

  // updateSearchResults(queue: string, change: string) {
  //   sessionStorage.setItem("queue", queue);
  //   queue = queue.toLowerCase();
  //   this.courseService.set(null);
  //   this.searchResults = this.courseService.search(queue, /^[0-9]+$/.test(queue));
  // }

}
