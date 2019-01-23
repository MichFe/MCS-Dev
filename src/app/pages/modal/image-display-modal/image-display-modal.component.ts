import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-display-modal',
  templateUrl: './image-display-modal.component.html',
  styleUrls: ['./image-display-modal.component.css']
})
export class ImageDisplayModalComponent implements OnInit {

  @Input()
  imagen:any; 

  constructor() { }

  ngOnInit() {
  }

}
