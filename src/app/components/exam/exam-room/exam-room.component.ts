import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { Observable, observable, timer } from 'rxjs';
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
   * init document
   *
   */
  public user: any = Auth.user();

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
  time: any = timer(1000, 1000);
  subscribe: any;

  constructor(private globalService: GlobalService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute) {

    if (this.route.snapshot.paramMap.has('id')) {
      this.get(this.route.snapshot.paramMap.get('id'));
    }
  }

  /*test():Observable<any> {
    console.log('timer is run');
    //return new Observable(1);
  }*/

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
      if (res.status == 1) {
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
      } else {
        Message.error(res.message);
      }
    });
  }

  /**
   * build resource object will be sent to backend
   *
   */
  getExam() {
    let resource = {
      student_exam_id: this.resource.id,
      exam_id: this.resource.exam.id,
      questions: []
    };

    this.resource.questions.forEach(element => {
      let item = {
        student_detail_id: element.id,
        question_id: element.question.id,
        answer: element.answer
      };
      resource.questions.push(item);
    });

    return resource;
  }

  send() {
    var self = this;
    Message.confirm(Helper.trans('are you sure'), () => {
      self.store();
    });
  }

  store() {
    let data = this.getExam();
    Helper.loader(true);
    this.globalService.store('student/exam-room/store', data).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
      } else{
        Message.error(res.message);
      }
      Helper.loader(false);
      Helper.refreshComponent(this.router, '/exams');
    });
  }

  goto(step) {
    this.selectedStep = step;
    $('.question').slideUp(100);
    $('.question-'+step).slideDown(200);
  }

  initTimer() {
    this.subscribe = this.time.subscribe((value) => {
      console.log(value);
      if (this.seconds < 59) {
        this.seconds ++;
      } else {
        this.seconds = 0;
        this.minutes --;
        if (this.minutes <= 0) {
          this.endExam();
        }
      }
    });
  }

  /**
   *
   */
  endExam() {
    Message.success(Helper.trans('time is out'));
    this.subscribe.unsubscribe();
    this.store();
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
