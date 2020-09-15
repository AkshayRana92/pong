import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnChanges {

  @Input() message: string;
  messages: string[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['message']) {
      if (changes['message'].currentValue) {
        if (this.messages.length > 10) {
          this.messages.shift();
          this.messages.push(changes['message'].currentValue);
        }
      }
    }
  }

}
