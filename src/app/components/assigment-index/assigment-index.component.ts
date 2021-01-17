import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Auth } from 'src/app/shared/auth';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assigment-index',
  templateUrl: './assigment-index.component.html',
  styleUrls: ['./assigment-index.component.scss']
})
export class AssigmentIndexComponent implements OnInit {

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
  public response: any = {};

  /**
   * filter inputs
   *
   */
  public assignments: any = [];

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
  public levels: any = [];

  /**
   * types of assignment
   *
   */
  public types: any = [];

  /**
   * courses of assignment
   *
   */
  public courses: any = [];

  /**
   * assignments of assignment
   *
   */
  public lectures: any = [];

  /**
   * select item to edit it
   *
   */
  public departments: any = [];


  /**
   * fields of assignment table
   *
   */
  public fields: any = [
    'name',
    'level_id',
    'faculty_id',
    'code',
    'credit_hour',
    'description',
    'final_degree',
    'active',
    'created_at',
    'updated_at'
  ];

  /**
   * url of import from excel api
   *
   */
  public importApi = "assignments/import";

  /**
   * url of excel template file
   *
   */
  public importTemplateUrl = environment.apiUrl + "/assignments/import-file?api_token="+Auth.getApiToken();

  /**
   * url of export api
   *
   */
  public exportApi = "assignments/export";

  /**
   * url of export api
   *
   */
  public action: any;

  /**
   * url of export api
   *
   */
  public reload = false;

  /**
   * isSubmitted
   *
   */
  public isSubmitted = false;

  /**
   * url of export api
   *
   */
  public archiveLoad = false;

  /**
   * auth of user
   *
   */
  public auth = Auth.user();


  constructor(private globalService: GlobalService, private sanitizer: DomSanitizer) {
    this.action = () => { this.get(); };
  }

  /**
   * init items of breadcrumb
   *
   */
  initBreadcrumbData() {
    this.breadcrumbData = [
      {name: 'assigment page', url: '#'}
    ];
  }

  /**
   * load all assignment data
   *
   */
  get(data=null) {
    let params = (data)? data: this.filter;
    this.reload = true;
    this.archiveLoad = false;
    this.globalService.get("student/assignments", params).subscribe((res) => {
      this.response = res;
      this.assignments = this.response.data;
      this.reload = false;
      //
      this.prePagniation();
    });
  }

  /**
   * load all assignment data
   *
   */
  loadstudentCourses(data=null) {
    this.globalService.get("student/courses").subscribe((res: any) => {
      this.courses = res.data;
    });
  }

  /**
   * load all assignment data
   *
   */
  loadstudentLectures(data=null) {
    this.globalService.get("student/lectures").subscribe((res) => {
      this.lectures = res;
    });
  }

  /**
   * filter with course
   *
   */
  filterWithCourse(course_id) {
    this.filter.course = course_id;
    this.get();
  }


  /**
   * show add assignment modal
   *
   */
  create() {
    this.resource = {};
    this.$('#formModal').modal('show');
  }

  /**
   * show add assignment modal
   *
   */
  edit(item) {
    this.resource = item;
    this.resource.file = null;
    this.$('#formModal').modal('show');
  }

  /**
   * show import assignments from excel file
   *
   */
  import() {
    this.$('#importExcelModal').modal('show');
  }

  /**
   * show export assignments from excel file
   *
   */
  export() {
    this.$('#exportExcelModal').modal('show');
  }

  /**
   * trust url
   *
   */
  trustUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }


  /**
   * load all filter data
   * load levels
   * load types
   * load departments
   * load faculties
   */
  loadSettings() {
    this.get();
    //
    this.globalService.get("levels").subscribe((r) => {
      this.levels = r;
    });
    this.globalService.get("departments").subscribe((r) => {
      this.departments = r;
    });
    this.types = ['normal', 'graduation'];
  }

  /**
   * pre panination
   */
  prePagniation() {
    Helper.prepagination(this.response);
    console.log(this.response);
  }

  setDataContainerStyle() {
    let height = (window.innerHeight - 250) + "px";
    this.document.nicescroll('.data-container', {height: height});
  }

  loadFile(e, item,  key) {
    Helper.loadImage(e, key, item);

  }

  validate(item) {
    let valid = true;

    if (!item.student_file) {
      valid = false;
      Message.error(Helper.trans("upload assigment file"));
    }

    return valid;
  }

  /**
   * send assignment object to api
   *
   */
  send(item) {
     this.update(item);
  }

  /**
   * update assignment
   *
   */
  update(item) {
    console.log(this.resource);
    if (!this.validate(item)) {
      return;
    }
    item.isSubmitted = true;
    item.assignment_id = item.id;
    this.globalService.store("student/student-assignments/update", Helper.toFormData(item)).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
        this.get();
      } else {
        Message.error(res.message);
      }
      item.isSubmitted = false;
    });
  }

  ngOnInit() {
    this.initBreadcrumbData();
    this.loadSettings();
    this.loadstudentCourses();
    this.loadstudentLectures();
    let _this = this;
    //
    setTimeout(()=>{
      _this.setDataContainerStyle();
    }, 500);
  }
}
