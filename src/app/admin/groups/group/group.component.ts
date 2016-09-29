import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { GroupService } from '../group.service';
import { DbGroup, DbOrganization } from '../../../db-models/organ';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, CanComponentDeactivate {

  id: number;
  creatingNew: boolean = false;

  organizationList: DbOrganization[];

  form: FormGroup;
  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  mandatoryCtrl: FormControl;
  orientationCtrl: FormControl;
  organizationCtrl: FormControl;

  originalData: DbGroup = { 
    grp_id: null,
    grp_name: null,
    grp_description: null,
    grp_mandatory: null,
    grp_orientation: null,
    org_id: null
  };
  pleaseSave: boolean = false;

  errorMsg: string = '';
  errorDetails: string = '';

  constructor(private route: ActivatedRoute, public router: Router,
    private fb: FormBuilder, private gs: GroupService) { }

  ngOnInit() {
    this.nameCtrl = new FormControl('', Validators.required);
    this.descriptionCtrl = new FormControl('', Validators.required);
    this.mandatoryCtrl = new FormControl('', Validators.required);
    this.orientationCtrl = new FormControl('', Validators.required);
    this.organizationCtrl = new FormControl('', Validators.required);
    this.form = this.fb.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      mandatory: this.mandatoryCtrl,
      orientation: this.orientationCtrl,
      organization: this.organizationCtrl
    });

    this.gs.loadOrganizations().subscribe(organs => this.organizationList = organs);

    this.route.data.forEach((data: { group: DbGroup }) => {
      if ('group' in data) {
        this.id = data.group.grp_id;
        this.creatingNew = false;
        this.nameCtrl.setValue(data.group.grp_name);
        this.descriptionCtrl.setValue(data.group.grp_description);
        this.mandatoryCtrl.setValue(data.group.grp_mandatory);
        this.orientationCtrl.setValue(data.group.grp_orientation);
        this.organizationCtrl.setValue(data.group.org_id);
      } else {
        this.creatingNew = true;
        this.nameCtrl.setValue('');
        this.descriptionCtrl.setValue('');
        this.mandatoryCtrl.setValue('');
        this.orientationCtrl.setValue('');
        this.organizationCtrl.setValue('');
      }
      this.setOriginalDataFromFields();
      this.errorMsg = '';
      this.errorDetails = '';
    });
  }

  onSubmit() {
    this.setOriginalDataFromFields();
    if (this.creatingNew) {
      this.gs.addGroup(this.nameCtrl.value, this.descriptionCtrl.value,
        this.mandatoryCtrl.value, this.orientationCtrl.value, this.organizationCtrl.value)
        .subscribe((ret: number) => {
          this.id = ret;
          this.goBackToList(true);
        },
        (err) => {
          this.errorMsg = 'Error occured while adding a group';
          this.errorDetails = err.text();
        });
    } else {
      this.gs.updateGroup(this.id, this.nameCtrl.value, this.descriptionCtrl.value,
        this.mandatoryCtrl.value, this.orientationCtrl.value, this.organizationCtrl.value)
        .subscribe(ret => {
          this.goBackToList(true);
        },
        (err) => {
          this.errorMsg = 'Error while updating a group';
          this.errorDetails = err.text();
        });
    }
  }

  doCancel() {
    this.setOriginalDataFromFields();
    this.goBackToList();
  }

  doDelete() {
    this.setOriginalDataFromFields();
    this.gs.deleteGroup(this.id).subscribe(ret => {
      this.goBackToList();
    },
    (err) => {
      this.errorMsg = 'Error while deleting a group';
      this.errorDetails = err.text();
    });
  }

  private goBackToList(withSelected = false) {
    if (withSelected) {
      this.router.navigate(['/admin/groups', { selid: this.id }]);
    } else {
      this.router.navigate(['/admin/groups']);
    }
  }

  canDeactivate() {
    if (this.originalDataChanged()) {
      this.pleaseSave = true;
      return false;
    } else {
      return true;
    }
  }

  private setOriginalDataFromFields() {
    this.originalData.grp_name = this.nameCtrl.value;
    this.originalData.grp_description = this.descriptionCtrl.value;
    this.originalData.grp_mandatory = this.mandatoryCtrl.value;
    this.originalData.grp_orientation = this.orientationCtrl.value;
    this.originalData.org_id = this.organizationCtrl.value;
  }

  private originalDataChanged() {
    return this.originalData.grp_name !== this.nameCtrl.value
    || this.originalData.grp_description !== this.descriptionCtrl.value
    || this.originalData.grp_mandatory !== this.mandatoryCtrl.value
    || this.originalData.grp_orientation !== this.orientationCtrl.value
    || this.originalData.org_id !== this.organizationCtrl.value;
  }

}
