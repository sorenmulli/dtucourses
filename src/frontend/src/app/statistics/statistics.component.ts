import { Component, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { IData, ILayout } from '../plotly/plotly';

interface IPlotInput {
  data: IData;
  layout: ILayout;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  show: "loading" | "plots" | "error" = "loading";
  errorMsg: string;

  grades = ["-3", "00", "02", "4", "7", "10", "12"];
  avgHist: IPlotInput;
  gradeDist: IPlotInput;

  ngOnInit() {
    this.httpService.getStats().then(stats => {
      console.log(stats);
      this.show = "plots";
      this.avgHist = {
        data: {
          x: stats.mean_hist.map((val, index) => index + 1),
          y: stats.mean_hist.map(val => val.avg),
        },
        layout: {xaxis: this.getTickLayout(stats.mean_hist.map(val => this.formatPeriod(val.period)))},
      };
      const latestGradeDist = stats.grade_dist[stats.grade_dist.length-1];
      this.gradeDist = {
        data: {
          x: this.grades.map((val, index) => index + 1),
          y: latestGradeDist.dist,
        },
        layout: {xaxis: this.getTickLayout(this.grades)},
      }
    }).catch(reason => {
      this.show = "error";
      console.log(reason);
      this.errorMsg = reason.status + " " + reason.statusText;
    })
  }

  getTickLayout(ticks: string[]) {
    return {
      tickmode: "array",
      tickvals: ticks.map((val, index) => index + 1),
      ticktext: ticks,
    };
  }

  formatPeriod(period: string): string {
    const prettyPeriod = period.replace("summer", "Sommer").replace("winter", "Vinter");
    return prettyPeriod.substring(4) + " " + prettyPeriod.substring(0, 4);
  }
}
