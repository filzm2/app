import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import { IRole } from "@models/role/role.model";
import { TRoleCheckboxGroup } from "@page/content/security/security.interface";
import { of } from "rxjs";
import { turn90, verticalHide, verticalHideL } from "@page/content/security/roles/role.animation";
import { Router } from "@angular/router";
import {select, Store} from "@ngrx/store";
import {selectAllUsersOptions} from "@store/selectors/security/security.selector";
import {UserRelated} from "@store/actions/settings/security.actions";

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  animations: [verticalHide, verticalHideL, turn90],
})
export class RoleFormComponent implements OnInit, OnChanges {
  public formGroup: FormGroup;
  public groupCheckboxesState: {[key: string]: {check: boolean, indeterminate: boolean}} = {
    all: {check: false, indeterminate: false},
    admin: {check: false, indeterminate: false},
    edit: {check: false, indeterminate: false},
    read: {check: false, indeterminate: false},
  };
  public animationState: {[key: string]: 'open' | 'close'} = {
    all: 'open',
    admin: 'open',
    edit: 'open',
    read: 'open',
  }
  public users$ = this.store.pipe(select(selectAllUsersOptions));
  @Input() public role: IRole;
  @Output() public submitForm = new EventEmitter();
  constructor(private fb: FormBuilder, private router: Router, private store: Store) {
    this.initFormGroup();
    this.store.dispatch(UserRelated());
  }

  ngOnInit(): void {
  }


  private initFormGroup() {
    this.formGroup = this.fb.group({
      name: [this.role?.name ?? '', Validators.required],
      users: [this.role?.users ?? []],

      admin: this.fb.group({
        name: 'admin',
        can_create_db: this.role?.permissions?.can_create_db ?? false,
        can_delete_udbmv: this.role?.permissions?.can_delete_udbmv ?? false,
        can_create_udbmv: this.role?.permissions?.can_create_udbmv ?? false,
        can_delete_rmv: this.role?.permissions?.can_delete_rmv ?? false,
        can_create_rmv: this.role?.permissions?.can_create_rmv ?? false,
        // available_reset_my_password: this.role?.permissions?.available_reset_my_password ?? false,
        // can_connect_to_db: this.role?.permissions?.can_connect_to_db ?? false,
      }, {validators: [this.getCheckboxGroupValidator()]}),

      edit: this.fb.group({
        name: 'edit',
        can_edit_dataset: this.role?.permissions?.can_edit_dataset ?? false,
        can_create_dataset: this.role?.permissions?.can_create_dataset ?? false,
        can_create_dashboard: this.role?.permissions?.can_create_dashboard ?? false,
        can_edit_dashboard: this.role?.permissions?.can_edit_dashboard ?? false,
        can_create_chart: this.role?.permissions?.can_create_chart ?? false,
        can_edit_rmv: this.role?.permissions?.can_edit_rmv ?? false,
        can_edit_udbmv: this.role?.permissions?.can_edit_udbmv ?? false,
        // can_filter_dashboard: this.role?.permissions?.can_filter_dashboard ?? false,
        // can_edit_profile: this.role?.permissions?.can_edit_profile ?? false,
        // can_edit_favorite_status: this.role?.permissions?.can_edit_favorite_status ?? false,
        // available_sql: this.role?.permissions?.available_sql ?? false,
      }, {validators: [this.getCheckboxGroupValidator()]}),

      read: this.fb.group({
        name: 'read',
        can_comment: this.role?.permissions?.can_comment ?? false,
        can_read_database: this.role?.permissions?.can_read_database ?? false,
        can_read_chart: this.role?.permissions?.can_read_chart ?? false,
        can_read_log: this.role?.permissions?.can_read_log ?? false,
        can_read_rmv: this.role?.permissions?.can_read_rmv ?? false,
        can_read_udbmv: this.role?.permissions?.can_read_udbmv ?? false,
        // can_read_dashboard: this.role?.permissions?.can_read_dashboard ?? false,
        // can_read_dataset: this.role?.permissions?.can_read_dataset ?? false,
        // can_read_saved_query: this.role?.permissions?.can_read_saved_query ?? false,
        // can_read_annotation: this.role?.permissions?.can_read_annotation ?? false,
        // can_read_control_panel: this.role?.permissions?.can_read_control_panel ?? false,
      }, {validators: [this.getCheckboxGroupValidator()]}),

    }, {validators: [this.getCrossValidator()]});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.role?.currentValue && (changes.role.currentValue !== changes.role.previousValue)) {
      this.initFormGroup();
    }
  }

  public checkAll(value: boolean, group: TRoleCheckboxGroup) {

    if (group === 'all') {
      Object.keys(this.groupCheckboxesState).forEach((key: TRoleCheckboxGroup) => {
        if (key === 'all') {
          return;
        }
        const form = this.getFormGroup(key);
        Object.keys(form?.controls).forEach((field: keyof IRole) => {
          if (field === 'name') {
            return;
          }
          this.getFormControl(form, field).setValue(value);
        });
      });
      return;

    }
    const form = this.getFormGroup(group);

    Object.keys(form?.controls).forEach((field: keyof IRole) => {
      if (field === 'name') {
        return;
      }
      this.getFormControl(form, field).setValue(value);
    });

  }

  private getCheckboxGroupValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      let name: TRoleCheckboxGroup = 'all';

      const check = Object.keys(group.controls).every((control: keyof IRole) => {
        const value: boolean = group.controls[control].value;
        if (typeof value === 'string') {
          name = value as TRoleCheckboxGroup;
          return true;
        }
        return value;
      });

      const indeterminate = Object.keys(group.controls).some((control: keyof IRole) => {
        const value: boolean = group.controls[control].value;
        if (typeof value === 'string') {
          name = value as TRoleCheckboxGroup;
          return false;
        }
        return value;
      });
      this.groupCheckboxesState[name] = {
        indeterminate: indeterminate && !check,
        check,
      }

      this.groupCheckboxesState[name] = {
        indeterminate: indeterminate && !check,
        check,
      }
      this.allCheckboxValidate();
      return null;
    };
  }

  public getCrossValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null =>  {
      const canCreateDashboard = group.get('edit')?.get('can_create_dashboard');
      const canEditDashboard = group.get('edit')?.get('can_edit_dashboard');
      const canReadChart = group.get('read')?.get('can_read_chart');
      const canCreateChart = group.get('edit')?.get('can_create_chart');
      if ((canCreateDashboard.value || canEditDashboard.value) && !canReadChart.value) {
        canReadChart.setValue(true,{ emitEvent: false });
      }
      if ((canCreateDashboard.value || canEditDashboard.value) && !canCreateChart.value) {
        canCreateChart.setValue(true,{ emitEvent: false });
      }
      return null;
    }
  }

  public getFormControl(group: FormGroup, name: keyof IRole): FormControl {
    return group?.get(name) as FormControl;
  }

  public getFormGroup(name: TRoleCheckboxGroup): FormGroup {
    return this.formGroup?.get(name) as FormGroup;
  }

  public toggleAnimationState(name: TRoleCheckboxGroup) {
    this.animationState[name] = this.animationState[name] === 'open' ? 'close' : 'open';
  }

  public saveChanges() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.formGroup.value);
  }

  public routeBack() {
    this.router.navigate([ '/main/security/roles/' ]).then();
  }

  private allCheckboxValidate() {
    let someSelect = false;
    const check = Object.keys(this.groupCheckboxesState).every((key: TRoleCheckboxGroup) => {
      if (key === 'all') {
        return true;
      }
      return this.groupCheckboxesState[key].check;
    });

    const indeterminate = Object.keys(this.groupCheckboxesState).some((key: TRoleCheckboxGroup) => {
      if (key === 'all') {
        return false;
      }
      someSelect ||= this.groupCheckboxesState[key].check;
      return this.groupCheckboxesState[key].indeterminate;
    });

    this.groupCheckboxesState.all = {
      indeterminate: indeterminate || (someSelect && !check),
      check,
    }
  }
}
