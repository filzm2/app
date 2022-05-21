import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators as v } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as appState from "@store/reducers";
import { Router } from "@angular/router";
import { RowLevelListGet } from "@store/actions/settings/security.actions";
import { take, takeUntil } from "rxjs/operators";
import { selectRowLevelListState } from "@store/selectors/security/security.selector";
import { IRowLevel } from "@models/row-level/row-level.model";
import { ChipsAutocompleteFieldComponent } from "@shared/components/chips-autocomplete-field/chips-autocomplete-field.component";

@Component({
  selector: 'app-row-level-edit',
  templateUrl: './row-level-edit.component.html',
  styleUrls: ['./row-level-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowLevelEditComponent implements OnInit {
  public row: IRowLevel;
  public formGroup: FormGroup;
  public roles$: Observable<any>;
  public tables$: Observable<any>;
  public rowId: number;
  private _destroy$ = new Subject<null>();
  @ViewChild('includes') private includes: ChipsAutocompleteFieldComponent;
  @ViewChild('excludes') private excludes: ChipsAutocompleteFieldComponent;

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.initFormGroup();
    this.store.dispatch(RowLevelListGet({
      payload: {} }));
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe(router => this.initStateByUrl(router));
    this.roles$ = of([{text:'Admin', value: 'Admin', id: 1}, {text:'sql_lab', value: 'sql_lab', id: 2}, {text:'user', value: 'user', id: 3}, {text:'gamma', value: 'gamma', id: 4}]);
    this.tables$ = of(['table', 'table2', 'table3']);
  }

  public routeBack(): void {
    this.router.navigate([ 'main/security/row-level' ]).then();
  }

  public saveChanges(): void {

  }

  public getFormControl(name: keyof IRowLevel): FormControl {
    return this.formGroup?.get(name) as FormControl;
  }

  public roleSelected(options: any, includes: boolean): void {
    if (!(Array.isArray(options) && options.length)) {
      return;
    }
    if (includes) {
      this.excludes.clear();
      return;
    }
    this.includes.clear();
  }

  private initStateByUrl(router): void {
    this.rowId = router?.state?.params?.id;
    if (!this.rowId) {
      return;
    }

    this.store.pipe(takeUntil(this._destroy$), select(selectRowLevelListState)).subscribe(res => {
      if (Array.isArray(res.data)) {
        this.row = res.data.find(row => +this.rowId === +row.id);
        this.initFormGroup()
      }
    })
  }

  private initFormGroup(): void {
    this.formGroup = this.fb.group({
      tables: [Array.isArray(this.row?.tables) ? this.row.tables : [], [v.required]],
      roles_includes: [Array.isArray(this.row?.roles_includes) ? this.row.roles_includes : [], [v.required]],
      roles_excludes: [Array.isArray(this.row?.roles_excludes) ? this.row.roles_excludes : [], [v.required]],
      group_key: [this.row?.group_key ?? null, [v.required]],
      condition: [this.row?.condition ?? null, [v.required]],
    }, {
      validators: [this.getCrossValidator()]
    });
  }

  private getCrossValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {

      return null;
    };
  }
}
