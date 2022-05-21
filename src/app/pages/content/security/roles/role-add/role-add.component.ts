import { Component, OnInit } from '@angular/core';
import { IRole } from "@models/role/role.model";
import { of, Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as appState from "@store/reducers";
import { Router } from "@angular/router";
import { DialogService } from "@core/services/dialog.service";
import { take, takeUntil } from "rxjs/operators";
import { selectRoleState, selectSettingsPermissionsState } from "@store/selectors/security/security.selector";
import {RoleClear, RoleCreate, RoleListGet, RoleSave, UserRelated} from "@store/actions/settings/security.actions";
import * as fromRouter from "@ngrx/router-store";
import { RouterStateUrl } from "@store/reducers";

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {

  public routerState: any;
  public roleId: number;
  public isLoading = false;

  private _destroy$ = new Subject<null>();

  constructor(private store: Store, private router: Router) {
    this.store.pipe(takeUntil(this._destroy$), select(selectRoleState)).subscribe(state => {
      if (state.success) {
        this.store.dispatch(RoleClear());
        this.routeBack();
        this.isLoading = false;
      }
    });

  }

  ngOnInit(): void {

  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public routeBack() {
    this.router.navigate([ '/main/security/roles/' ]).then();
  }

  public save(data: any): void {
    const permissions =  {
      ...data.admin,
      ...data.edit,
      ...data.read
    };
    delete permissions.name;
    const result = {
      permissions,
      name: data.name,
      users: data.users,
    };
    this.store.dispatch(RoleCreate({payload: result}));
    this.isLoading = true;
  }
}
