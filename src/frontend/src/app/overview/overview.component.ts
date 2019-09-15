import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICourseExpand } from './overview';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  courses: any;//ICourseExpand[];

  constructor(private httpClient: HttpClient) { }

  async loadData() {
    try {
      this.courses = await this.httpClient.get(
        "https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/courses_expand.json"
      ).toPromise();
    } catch(error) {
      console.log(error);
    };
  }

  ngOnInit() {
    this.loadData();
  }

}
