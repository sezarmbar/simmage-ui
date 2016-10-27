import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { UsergroupsService, UsergroupData } from '../usergroups.service';


@Component({
  selector: 'app-usergroups-list',
  templateUrl: './usergroups-list.component.html',
  styleUrls: ['./usergroups-list.component.css']
})
export class UsergroupsListComponent implements OnInit {

  public usergroupsData: Observable<UsergroupData[]>;
  public selectedId: Observable<number>;

  constructor(public usergroups: UsergroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.usergroupsData = this.usergroups.loadUsergroups();
    this.selectedId = this.route.params.pluck<number>('selid');
  }
}
