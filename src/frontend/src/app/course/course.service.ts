import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { ICourse, ICourses } from "./course";
import data from "../../assets/complete_raw_data.json";

export function getGrades(course: ICourse, time: string | number = -1) {
  // Hvis timer en string, bruges det som key
  // Er det number, er indeksering som i python
  if (typeof time === "string") {
    return course.grades[time]
  } else if (time < 0) {
    const keys = Object.keys(course.grades);
    return course.grades[keys[keys.length+time]]
  } else {
    const keys = Object.keys(course.grades);
    return course.grades[keys[time]]
  }
}

export function getEvals(course: ICourse, time: string | number = -1) {
  // Hvis timer en string, bruges det som key
  // Er det number, er indeksering som i python
  if (typeof time === "string") {
    return course.evals[time]
  } else if (time < 0) {
    const keys = Object.keys(course.evals);
    return course.evals[keys[keys.length+time]]
  } else {
    const keys = Object.keys(course.evals);
    return course.evals[keys[time]]
  }
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  public time: Date;
  public courses: {[key: string]: ICourse};
  public courseNos: string[] = [];
  public courseNames: string[] = [];
  public currentCourse: ICourse | null;

  constructor() { }

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
    if (this.courses) return;
    this.time = new Date(data.time);
    this.courses = data.courses;
    this.courseNos = Object.keys(this.courses);
    for (let courseNo of this.courseNos) {
      this.courseNames.push(this.courses[courseNo].info.name.toLowerCase());
    }
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
    for(let key of Object.keys(object)) {
      newObject[key] = object[key];
      i ++;
      if (i >= n) {
        break;
      }
    }
    return newObject
  }
}
