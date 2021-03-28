import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() btnLink: string;
  @Input() btnText: string;
  @Input() btnIcon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
