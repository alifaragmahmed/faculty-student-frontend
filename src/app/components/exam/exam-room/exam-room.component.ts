import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { Auth } from 'src/app/shared/auth';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-exam-room',
  templateUrl: './exam-room.component.html',
  styleUrls: ['./exam-room.component.scss']
})
export class ExamRoomComponent implements OnInit {

  /**
   * init jquery
   *
   */
  public $: any = $;

  /**
   * init document
   *
   */
  public document: any = document;

  /**
   * Array of items of breadcrumb
   *
   */
  public breadcrumbData = [];

  /**
   * select item to edit it
   *
   */
  public resource: any = {
    questions: []
  };

  /**
   * url of export api
   *
   */
  public reload = false;
  public helper: any = Helper;

  selectedStep = 0;
  seconds = 0;
  minutes = 0;
  totalMinutes = 0;
  interval = null;

  constructor(private globalService: GlobalService, private sanitizer: DomSanitizer) {

  }

  /**
   * init items of breadcrumb
   *
   */
  initBreadcrumbData() {
    this.breadcrumbData = [
      {name: 'exams page', url: '#'},
      {name: this.resource.exam? this.resource.exam.name : '', url: '#', active: true, trans: false}
    ];
  }

  /**
   * load all exam data
   *
   */
  get(id=null) {
    this.reload = true;
    this.globalService.get("student/exam-room/"+id, {}).subscribe((res: any) => {
      this.resource = res.data;
      this.reload = false;
      this.minutes = this.resource.remaining_minutes;
      this.totalMinutes = this.resource.exam? this.resource.exam.minutes : 0;
      this.initBreadcrumbData();
      this.initTimer();
      //
      setTimeout(() => {
        this.$('[data-toggle="tooltip"]').tooltip();
      }, 1000);
    });
  }

  getExam() {

  }

  goto(step) {
    this.selectedStep = step;
    $('.question').slideUp(100);
    $('.question-'+step).slideDown(200);
  }

  initTimer() {
    this.interval= setInterval(() => {
      if (this.seconds < 59) {
        this.seconds ++;
      } else {
        this.seconds = 0;
        this.minutes --;
        if (this.minutes <= 0) {
          this.endExam();
        }
      }
    }, 1000);
  }

  /**
   *
   */
  endExam() {
    Message.success('done');
  }


  /**
   * show export exams from excel file
   *
   */
  start(item) {
    let _this = this;
    Message.confirm(Helper.trans("are you sure"), ()=>{

    });
  }


  /**
   * load all filter data
   * load levels
   * load types
   * load departments
   * load faculties
   */
  loadSettings() {
    this.get(5);
    //

  }


  trustUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.initBreadcrumbData();
    this.loadSettings();
    let _this = this;
    //
    setTimeout(() => {
      this.$('[data-toggle="tooltip"]').tooltip();
    }, 1000);
  }
}
