import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { ICourse, ICourseMin } from "./course";
import { HttpClient } from '@angular/common/http';

import * as data from "../../assets/course_min.json";

function parseData() {
  return JSON.parse(this.responseText);
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  public time: Date = new Date();
  public courses: {[key: string]: ICourseMin};
  public courseNos: string[] = [];
  public courseNames: string[] = [];
  public currentCourse: ICourse | null;

  constructor(private httpClient: HttpClient) { }

  get(courseNo: string): Promise<ICourse> {
    return this.httpClient.get<ICourse>(
      `https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/${courseNo}.json`
    ).toPromise();
  }

  set(courseNo: string) {
    if (courseNo === null) {
      this.currentCourse = null;
    } else {
      this.get(courseNo)
        .then(value => {
          this.currentCourse = value;
        })
        .catch(reason => {
          this.currentCourse = null;
        });
    }
  }

  loadData(force=false): void {
    // Henter data, hvis ikke allerede hentet
    if (this.courses && !force) return;
    this.time = new Date(data.time);
    this.courses = data.courses;
    this.courseNos = Object.keys(this.courses);
    for (let courseNo of this.courseNos) {
      this.courseNames.push(this.courses[courseNo].name.toLowerCase());
    }
  }

  search(queue: string, useCourseNo: boolean): {[key: string]: ICourseMin} {
    // Søger blandt alle kurser
    const searchables = useCourseNo ? this.courseNos : this.courseNames;
    let matches: {[key: string]: ICourseMin} = {};
    for (let i in searchables) {
      if (searchables[i].indexOf(queue) >= 0) {
        matches[this.courseNos[i]] = this.courses[this.courseNos[i]];
      }
    }
    return this.getNFirst(matches)
  }

  getNFirst(object: {[key: string]: ICourseMin}, n=0): {[key: string]: ICourseMin} {
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
