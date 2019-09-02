import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { ICourse, ICourses } from "./course";
import { HttpClient } from '@angular/common/http';

function parseData() {
  console.log(JSON.parse(this.responseText));
  return JSON.parse(this.responseText);
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  public time: Date = new Date();
  public courses: {[key: string]: ICourse};
  public courseNos: string[] = [];
  public courseNames: string[] = [];
  public currentCourse: ICourse | null;

  constructor(private httpClient: HttpClient) { }

  get(courseNo: string) {
    return this.courses[courseNo];
  }

  set(courseNo: string) {
    if (courseNo === null) {
      this.currentCourse = null;
    } else {
      this.currentCourse = this.get(courseNo);
    }
  }

  loadData(force=false): void {
    // Henter data, hvis ikke allerede hentet
    if (this.courses && !force) return;
    this.httpClient
      .get<ICourses>("https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/db.json")
      .toPromise()
      .then(value => {
        console.log(value);
        this.time = value.time;
        this.courses = value.courses;
        console.log(111);
        console.log(this.courses);
        this.courseNos = Object.keys(this.courses);
        for (let courseNo of this.courseNos) {
          this.courseNames.push(this.courses[courseNo].info.name.toLowerCase());
        }
      }).catch(reason => console.log(reason));
  }

  search(queue: string, useCourseNo: boolean): {[key: string]: ICourse} {
    const searchables = useCourseNo ? this.courseNos : this.courseNames;
    let matches: {[key: string]: ICourse} = {};
    for (let i in searchables) {
      if (searchables[i].indexOf(queue) >= 0) {
        matches[this.courseNos[i]] = this.courses[this.courseNos[i]];
      }
    }
    return this.getNFirst(matches)
  }

  getNFirst(object: {[key: string]: ICourse}, n=0): {[key: string]: ICourse} {
    if (n === 0) {
      n = Object.keys(object).length;
    }
    let i = 0;
    let newObject = {};
    for(let key of Object.keys(object).sort()) {
      newObject[key] = object[key];
      i ++;
      if (i >= n) {
        break;
      }
    }
    return newObject
  }
}
