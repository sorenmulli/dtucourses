import { Component, OnInit, Input } from '@angular/core';

import { ICourse, BgColours } from './course';


@Component({
  selector: 'course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {

  showCourseDescription: boolean = false;
  showStudieplan: boolean = false

  @Input() course: ICourse;
  bgColours: {
    grade: string;
    learning: string;
    worklevel: string;
    good: string;
    beer: string;
    quality: string;
  }

  constructor() { }

  ngOnInit() {
    this.bgColours = {
      grade: this.getHslColour(this.course.grades[0].exam_avg),
      learning: this.getHslColour(this.course.eval_points[0].learning),
      worklevel: this.getHslColour(this.course.eval_points[0].worklevel, true),
      good: this.getHslColour(this.course.eval_points[0].good),
      beer: this.getHslColour(this.course.composites.beer_points),
      quality: this.getHslColour(this.course.composites.quality_points),
    };
  }

  getHslColour(percentile: number, invert=false): string {

    // Beregner en hsl-farve (hue, saturation, lightness) baseret på et tal 0-100
    if (invert) percentile = 100 - percentile;
    percentile *= 1.2;
    return `hsl(${percentile}, 100%, 50%)`
  }
}
