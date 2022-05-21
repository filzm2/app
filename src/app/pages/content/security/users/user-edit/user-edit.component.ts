import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { select, Store } from "@ngrx/store";
import * as appState from "@store/reducers";
import { Router } from "@angular/router";
import { IUserInfo, IUserSave } from "@models/user/user.model";
import { take, takeUntil } from "rxjs/operators";
import {
  selectRoleListNameState,
  selectUserState
} from "@store/selectors/security/security.selector";
import { IUserSaveMiddle } from "@page/content/security/security.interface";
import { Observable, of, Subject } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators as v } from "@angular/forms";
import {
  RoleNameListGet,
  UserClear,
  UserCreate,
  UserGet,
  UserListGet,
  UserSave
} from "@store/actions/settings/security.actions";
import { DialogService } from "@core/services/dialog.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
  public user: IUserInfo;
  public formGroup: FormGroup;
  public roles$: Observable<any>;
  public userId: number;
  private _destroy$ = new Subject<null>();

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private fb: FormBuilder,
    private dialog: DialogService
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe(router => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectUserState)).subscribe(res => {
      if (res.success) {
        this.routeBack();
        this.store.dispatch(UserClear());
        return;
      }
      if (res.data?.result && this.userId) {
        this.user = res.data.result;
        this.initFormGroup()
      }
      this.dialog.errorHandler(res);
    })
    this.roles$ = this.store.pipe(takeUntil(this._destroy$), select(selectRoleListNameState));
    this.store.dispatch(RoleNameListGet());
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initStateByUrl(router): void {
    this.userId = router?.state?.params?.id;
    if (!this.userId) {
      return;
    }

    this.store.dispatch(UserGet({
      payload: this.userId
    }));
  }

  public routeBack(): void {
    this.router.navigate(['main/security/users']).then();
  }

  public saveChanges(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    if (this.userId) {
      const value = this.formGroup.value;
      const user: IUserInfo = {
        username: value.username,
        lastName: value.lastName,
        firstName: value.firstName,
        email: value.email,
        roles: value.roles,
        activity: value.activity,
      }

      this.store.dispatch(UserSave({
        payload: {
          data: user,
          id: this.userId,
        }
      }))
    } else {

      const value = this.formGroup.value;
      const user: IUserSave = {
        username: value.username ?? 'username',
        lastName: value.lastName,
        firstName: value.firstName,
        email: value.email,
        roles: value.roles,
        activity: value.activity,
        password: value.password,
      }

      this.store.dispatch(UserCreate({
        payload: user,
      }))
    }
  }

  private initFormGroup(): void {
    if (this.userId) {

      this.formGroup = this.fb.group({
        username: [this.user?.username ?? null, [v.required]],
        firstName: [this.user?.firstName ?? null, [v.required]],
        lastName: [this.user?.lastName ?? null, [v.required]],
        email: [this.user?.email ?? null, [v.required]],
        roles: [Array.isArray(this.user?.roles) ? this.user.roles : []],
        activity: [this.user?.activity ?? false, [v.required]],
      });
      return;
    }
    this.formGroup = this.fb.group({
      username: [this.user?.username ?? null, [v.required]],
      firstName: [this.user?.firstName ?? null, [v.required]],
      lastName: [this.user?.lastName ?? null, [v.required]],
      email: [this.user?.email ?? null, [v.required]],
      roles: [Array.isArray(this.user?.roles) ? this.user.roles : []],
      activity: [this.user?.activity ?? false, [v.required]],
      password: [null, [v.required]],
      passwordRepeat: [null, [v.required]],
    }, {
      validators: [this.getPasswordValidator()]
    });
  }

  public getFormControl(name: keyof IUserSaveMiddle): FormControl {
    return this.formGroup?.get(name) as FormControl;
  }

  private getPasswordValidator(): () => any {
    return () => {
      const pw1 = this.getFormControl('password')?.value;
      const pw2 = this.getFormControl('passwordRepeat')?.value;

      if (pw1 !== pw2) {
        this.getFormControl('passwordRepeat')?.setErrors({
          passwordRepeat: true
        })
        return {passwordRepeat: true};
      }
      this.getFormControl('passwordRepeat')?.setErrors(null)
      return null;
    }
  }
}
