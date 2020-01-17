import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.sass']
})
export class TimetableComponent implements OnInit {

  objKeys = Object.keys;
  objValues = Object.values;
  isDataLoaded: boolean;

  currentWeek: string;

  pageX: number;
  pageY: number;

  menu: HTMLElement;

  constructor(
    public _DataService: DataService,
    private _TranslateService: TranslateService
  ) {
    this._DataService._isDataLoaded.subscribe((res: boolean) => {
      this.isDataLoaded = res;
    });

    this._DataService._currentWeek.subscribe((res: string) => {
      this.currentWeek = res;
    });
  }

  ngOnInit() {
    this.dragSlider();
    this.menu = document.querySelector('.contextmenu');
  }

  getToday(): string {
    return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
  }

  getTranslatedDay(day: string) {
    return this._TranslateService.instant(`DAYS.${day}`);
  }

  getValues(week: string, day: string) {
    return Object.values(this._DataService.data['weeks'][week][day]);
  }

  dragSlider() {
    const slider: HTMLElement = document.querySelector('.timetable-container');
    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    slider.addEventListener('mousedown', (e) => {
      this.menu.style.display = 'none';
      isDown = true;
      slider.classList.add('grabbing-timetable-container');
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
    })

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('grabbing-timetable-container');
    })

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('grabbing-timetable-container');
    })

    slider.addEventListener('mousemove', (e) => {
      this.pageX = e.pageX;
      this.pageY = e.pageY;
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - startX) * 1;
      const walkY = (y - startY) * 1;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollTop - walkY;
    })
  }

  openContextMenu(event: HTMLElement, lesson: object, week: string, day: string) {
    this.menu.style.top = `${this.pageY}px`;
    this.menu.style.left = `${this.pageX - 240}px`;
    this.menu.style.display = 'block';

    this.deleteLesson = {
      lesson,
      week,
      day
    }
  }

  deleteProgress: number = 0;
  deleteLesson: object;

  holdHandler(e) {
    this.deleteProgress = e / 10;
    if(this.deleteProgress > 100) {
      this.deleteProgress = 0;
      this.menu.style.display = 'none';
      this._DataService.deleteLesson(this.deleteLesson['lesson'],this.deleteLesson['week'],this.deleteLesson['day'])
    }
  }
}
