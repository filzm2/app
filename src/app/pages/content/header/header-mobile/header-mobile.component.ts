import {Component, Input, OnInit} from '@angular/core';
import { CommonUpdate } from '@store/actions/common/common.actions';
import { Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import {IAllPermissions} from "@models/role/role.model";

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit {
  @Input() permissions: IAllPermissions;
  constructor(
    private store: Store<appState.State>,
    private authenticationService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public closeHeaderMobile(): void {
    this.store.dispatch(CommonUpdate({
      payload: {
        isHeaderMobileMenuShowed: false,
      },
    }));
  }

  public logoutClick(): void {
    this.closeHeaderMobile();
    this.authenticationService.logout();
    this.router.navigate(['/login/']);
  }
}
