import { Component, Input, OnInit } from '@angular/core';
import { DesignerCardComponent } from '../designer-profile/designer-card/designer-card.component';
@Component({
  selector: 'app-designer-list',
  templateUrl: './designer-list.component.html',
  styleUrls: ['./designer-list.component.css']
})
export class DesignerListComponent implements OnInit {
  @Input() designerCard: DesignerCardComponent;
  constructor() { }

  ngOnInit() {
  }

}
