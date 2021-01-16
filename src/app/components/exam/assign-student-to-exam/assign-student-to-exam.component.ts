import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HashTable } from 'angular-hashtable';
import { Auth } from 'src/app/shared/auth';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assign-student-to-exam',
  templateUrl: './assign-student-to-exam.component.html',
  styleUrls: ['./assign-student-to-exam.component.scss']
})
export class AssignStudentToExamComponent implements OnInit {

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
   * filter inputs
   *
   */
  public response: any = {
    data: []
  };

  /**
   * filter inputs
   *
   */
  public exams: any = [];

  /**
   * filter inputs
   *
   */
  public filter: any = {};

  /**
   * select item to edit it
   *
   */
  public resource: any = {};

  /**
   * select item to edit it
   *
   */
  public courses: any = [];


  /**
   * url of export api
   *
   */
  public action: any;
  public isLoadStudents = false;
  public window: any = window;
  public helper: any = Helper;
  public selectedStudents = new HashTable<any, any>();

  /**
   * url of export api
   *
   */
  public reload = false;

  constructor(private globalService: GlobalService, private sanitizer: DomSanitizer,  private router: ActivatedRoute) {
    if (this.router.snapshot.queryParamMap.has("exam_id")) {
      //this.loadexam(this.router.snapshot.queryParamMap.get('exam_id'));
    }
  }

  /**
   * init items of breadcrumb
   *
   */
  initBreadcrumbData() {
    this.breadcrumbData = [
      {name: 'exams page', url: '/exams'},
      {name: 'assign exam to student', url: '#'}
    ];
  }

  toggleStudent(item) {
    if (this.selectedStudents.has(item.id)) {
      this.selectedStudents.remove(item.id);
    } else {
      this.selectedStudents.put(item.id, item);
    }
  }
  /**
   * load all exam data
   *
   */
  loadStudents(data=null) {
    let params = (data)? data: this.filter;
    this.reload = true;
    this.globalService.get("doctor/exams", params).subscribe((res) => {
      this.response = res;
      this.exams = this.response.data;
      this.reload = false;
      //
      this.prePagniation();
    });
  }


  /**
   * pre panination
   */
  prePagniation() {
    Helper.prepagination(this.response);
    console.log(this.response);
  }

  ngOnInit() {
    this.initBreadcrumbData();
    let _this = this;
    //
  }
}
