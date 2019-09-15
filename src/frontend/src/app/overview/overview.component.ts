import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  async loadData() {
    try {
      const dat = await this.httpClient.get(
        "https://raw.githubusercontent.com/sorenmulli/dtucourses/master/src/backend/data/course_expand.json"
      ).toPromise();
      console.log(dat);
    } catch(error) {
      console.log(error);
    };
  }

  ngOnInit() {
    this.loadData();
  }

}
