import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICourseExpand } from './overview';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  courses: ICourseExpand[];
  errorMsg: string = null;
  reverseSort = {
    course_no: false,
    name: false,
    ECTS: false,
    exam_avg: false,
    good: false,
    worklevel: false,
    beer: false,
    quality: false,
  };

  constructor(private httpClient: HttpClient) { }

  async loadData() {
    try {
      this.courses = await this.httpClient.get<ICourseExpand[]>(
        "https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/courses_expand.json"
      ).toPromise();
      this.errorMsg = null;
    } catch(error) {
      this.courses = null;
      this.errorMsg = error.status + ": " + error.statusText;
    };
  }

  ngOnInit() {
    this.loadData();
  }

  sortCourses(by: string) {
    console.log(this.reverseSort);
    this.courses = this.courses.sort(
      (a, b) => {
        let toReturn: number;
        if (a[by] === null) return 1;
        if (b[by] === null) return -1;
        if (a[by] < b[by]) toReturn = -1;
        if (a[by] === b[by]) toReturn = 0;
        if (a[by] > b[by]) toReturn = 1;
        return this.reverseSort[by] ? -toReturn : toReturn;
      }
    );
    for (let key of Object.keys(this.reverseSort)) {
      if (key == by) {
        console.log(1);
        this.reverseSort[key] = !this.reverseSort[key];
      } else {
        this.reverseSort[key] = false;
      };
    }
    this.reverseSort[by] = !this.reverseSort[by];
  }

}
