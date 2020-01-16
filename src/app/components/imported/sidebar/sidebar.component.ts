import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {

  constructor(
    public _Router: Router
  ) { }

  ngOnInit() {
    this.moveActiveLinkBar();
  }

  moveActiveLinkBar() {
    var bar: HTMLElement = document.querySelector('.sidebar').querySelector('.menu').querySelector('.bar');

    var menu: HTMLElement = document.querySelector('.sidebar').querySelector('.menu');
    var menuItems: NodeListOf<HTMLLIElement> = menu.querySelectorAll('li');

    menuItems.forEach(elem => {
      elem.addEventListener('click', () => {
        let elemPos = elem.offsetTop;
        bar.style.top = `${elemPos + 12.5}px`;
      });
    });
  }

}
