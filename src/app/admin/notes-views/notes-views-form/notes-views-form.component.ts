import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CanComponentDeactivate } from '../../../services/guards/can-deactivate.guard';
import { DbNotesviewGet } from '../../../services/backend/db-models/notes';
import { NotesService } from '../../../services/backend/notes.service';
import { NotesViewsService } from '../notes-views.service';
import { TopicService } from '../../../services/backend/topic.service';

@Component({
  selector: 'app-notes-views-form',
  templateUrl: './notes-views-form.component.html',
  styleUrls: ['./notes-views-form.component.css']
})
export class NotesViewsFormComponent implements OnInit, AfterViewInit, CanComponentDeactivate {

  @ViewChild('getfocus') getfocus: ElementRef;

  id: number;

  form: FormGroup;
  nameCtrl: FormControl;
  topicsCtrl: FormControl;

  topicsList: any[] = [];

  originalData: any = null;
  pleaseSave = false;

  errorMsg = '';
  errorDetails = '';

  constructor(private route: ActivatedRoute, public router: Router,
    private fb: FormBuilder, public service: NotesViewsService,
    private topicService: TopicService, private notesService: NotesService) { }

  ngOnInit() {

    this.topicService.loadTopics().subscribe(topics => {
      this.topicsList = topics.map(t => ({ id: t.top_id, name: t.top_name }));
    });

    this.route.data.pluck('notesViews')
      .subscribe((element: DbNotesviewGet) => {
        this.originalData = element;
        this.id = element ? element.nov_id : null;
        this.errorMsg = '';
        this.errorDetails = '';
        this.pleaseSave = false;
        if (this.form) {
          this.updateForm(element);
        } else {
          this.createForm(element);
        }
      });
  }
  ngAfterViewInit() {
    setTimeout(_ => this.getfocus.nativeElement.focus(), 0);
  }

  private createForm(data: DbNotesviewGet) {
    this.nameCtrl = new FormControl(data ? data.nov_name : '', Validators.required);
    this.topicsCtrl = new FormControl(data ? data.top_ids : []);
    this.form = this.fb.group({
      name: this.nameCtrl,
      topics: this.topicsCtrl
    });
  }

  private updateForm(data: DbNotesviewGet) {
    this.nameCtrl.setValue(data ? data.nov_name : '');
    this.topicsCtrl.setValue(data ? data.top_ids : []);
  }

  onSubmit() {
    if (!this.id) {
      this.service.addNotesViews(
        this.nameCtrl.value,
        this.topicsCtrl.value)
        .subscribe((ret: number) => {
          this.id = ret;
          this.goBackToList(true);
        },
        (err) => {
          this.errorMsg = 'Error adding notes-views';
          this.errorDetails = err.text();
        });
    } else {
      this.service.updateNotesViews(
        this.id,
        this.nameCtrl.value,
        this.topicsCtrl.value)
        .subscribe(ret => {
          this.goBackToList(true);
        },
        (err) => {
          this.errorMsg = 'Error updating notes-views';
          this.errorDetails = err.text();
        });
    }
  }

  doCancel() {
    this.goBackToList();
  }

  doReset() {
    this.createForm(this.originalData);
    this.pleaseSave = false;
  }

  doDelete() {
    this.service.deleteNotesViews(this.id).subscribe(ret => {
      this.goBackToList();
    },
      (err) => {
        this.errorMsg = 'Error deleting notes-views';
        this.errorDetails = err.text();
      });
  }

  goBackToList(withSelected = false) {
    if (this.form) {
      this.form.reset();
    }
    if (withSelected) {
      this.router.navigate(['/admin/notes-views', { selid: this.id }]);
    } else {
      this.router.navigate(['/admin/notes-views']);
    }
  }

  canDeactivate() {
    const ret = this.form.pristine;
    this.pleaseSave = !ret;
    return ret;
  }
}
