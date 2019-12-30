import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICoursesMin, ICourse } from '../course/course';
import { IStats } from '../statistics/statistics';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getCoursesMin(): Promise<ICoursesMin> {
    return this.http.get<ICoursesMin>("https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/course_min.json").toPromise();
  }

  getCourse(courseNo: string): Promise<ICourse> {
    return this.http.get<ICourse>(`https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/courses/${courseNo}.json`).toPromise();
  }

  getStats(): Promise<IStats> {
    return this.http.get<IStats>("https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/stats.json").toPromise();
  }
}
