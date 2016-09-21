import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../shared/user.service';

@Component({
// no need: selector: 'app-main-center',
  templateUrl: 'main-center.component.html',
  styleUrls: ['main-center.component.css']
})
export class MainCenterComponent implements OnInit {

  constructor(private user: UserService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.user.logout();
  }

  isAdmin() {
    return this.user.isAdmin();
  }

  onAdmin() {
    this.router.navigate(['/admin']);
  }
}
