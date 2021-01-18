import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  // number of question in exam
  @Input() number: any = 0;

  // question object
  @Input() resource: any = {};
  @Input() item: any = {};
  constructor() { }

  ngOnInit() {
  }

  selectAnswer(choice, checked) {
    if (checked) {
      this.resource.answer = choice.text;
      this.item.answer = choice.text;
    }
  }

}
