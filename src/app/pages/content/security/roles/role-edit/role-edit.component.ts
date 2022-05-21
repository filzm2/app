import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {combineLatest, forkJoin, of, Subject} from "rxjs";
import { select, Store } from "@ngrx/store";
import * as appState from "@store/reducers";
import { RouterStateUrl } from "@store/reducers";
import { Router } from "@angular/router";
import { DialogService } from "@core/services/dialog.service";
import { take, takeUntil } from "rxjs/operators";
import {
  selectAllUsersOptions,
  selectRoleState,
  selectSettingsPermissionsState
} from "@store/selectors/security/security.selector";
import * as fromRouter from "@ngrx/router-store";
import { IRole } from "@models/role/role.model";
import {
  RoleClear,
  RoleCreate,
  RoleGet,
  RoleListGet,
  RoleSave,
  UserRelated
} from "@store/actions/settings/security.actions";

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['../../users/users.component.scss', './role-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoleEditComponent implements OnInit {

  public permissions = {
    canRead: false,
    canWrite: false,
  };
  public isLoading = false;
  public routerState: any;
  public roleId: number;

  public role: IRole;
  public users = [];
  public searchModel = '';
  public availableUsers: { text: string; id: number }[] = [];
  private _destroy$ = new Subject<null>();
  private usersState = [];

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: DialogService,
  ) {

    this.store.dispatch(UserRelated());
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe(router => this.initStateByUrl(router));

    combineLatest([this.store.pipe(select(selectRoleState)),
              this.store.pipe(select(selectAllUsersOptions))])
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {
        if(res[0].success) {
          this.routeBack();
          this.store.dispatch(RoleClear());
          return;
        }

        if (res[0].data) {
          this.role = res[0].data?.result;
          this.users = res[0].data?.result?.users.slice(0, 9);
          this.usersState = [...res[0].data?.result?.users];
          const usersId = this.usersState.map(user => user.id);
          this.availableUsers = res[1]?.filter((user) => {
            return !usersId.includes(user.id);
          }) || [];

        }
        this.dialog.errorHandler(res[0]);
        this.isLoading = false;
      });

    this.store.pipe(takeUntil(this._destroy$), select(selectSettingsPermissionsState))
      .subscribe((res) => this.permissions = {canRead: true, canWrite: true});

    this.isLoading = true;
    // запрос прав
    // this.store.dispatch(UserGetInfo({payload: {keys: ['permissions']}}));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initStateByUrl(router: fromRouter.RouterReducerState<RouterStateUrl>): void {
    this.roleId = router.state.params.id;
    this.store.dispatch(RoleGet({payload: this.roleId}))
    this.routerState = router;
  }

  public selectUser(user: any, index: number): void {
    this.usersState.unshift({
      ...user,
      name: user.text
    });
    this.onSearch(this.searchModel);
    this.availableUsers.splice(index, 1);
  }

  public onSearch(match: string): void {
    if (typeof match === 'string') {
      this.users = this.usersState.filter(user => {
       return !!~user.name.toLowerCase?.().indexOf(match.toLowerCase());
      }).slice(0, 9);
    }
  }

  public routeBack() {
    this.router.navigate([ '/main/security/roles/' ]).then();
  }

  public deleteUser(user: any): void {
    const index = this.usersState.indexOf(user);
    if (index === -1) {
      return;
    }
    this.usersState.splice(index, 1);
    this.onSearch(this.searchModel);
    this.availableUsers.unshift({
      ...user,
      text: user.name,
    });
  }

  public save(data): void {

    const permissions =  {
      ...data.admin,
      ...data.edit,
      ...data.read
    };
    delete permissions.name;
    const result = {
      permissions,
      name: data.name,
      users: this.usersState.map(user => user.id),
    };
    this.store.dispatch(RoleSave({payload: { body: result, id: this.roleId}}));
    this.isLoading = true;
  }
}

