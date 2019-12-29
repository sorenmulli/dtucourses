import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { ICourseMin } from './course';

@Pipe({ name: 'filterCourses' })
export class FilterPipe implements PipeTransform {
    transform(courses: ICourseMin[], search: string): ICourseMin[] {
        return search ? courses.filter(course => course.course_no.indexOf(search.toLowerCase()) > -1 || course.name.toLowerCase().indexOf(search.toLowerCase()) > -1) : courses;
    }
}

@Pipe({name: "safe"})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
