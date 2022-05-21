import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ITab, ITabButtonSettings } from '@page/content/dataset/dataset.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { IDatasetSettings } from '@models/dataset/dataset-edit-settings.model';
import { DatasetOwnersGet } from '@store/actions/dataset/dataset.actions';

@Component({
  selector: 'app-dataset-edit-settings',
  templateUrl: './dataset-edit-settings.component.html',
  styleUrls: ['./dataset-edit-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetEditSettingsComponent implements OnInit, OnDestroy, ITab {
  public tabButtonSettings: ITabButtonSettings = null;
  public formGroup: FormGroup;
  public settings: IDatasetSettings;
  public owners: { text: string; value: string }[];

  constructor(
    private router: Router,
    private store: Store<appState.State>,
    private fb: FormBuilder
  ) {
    this.store.dispatch(
      DatasetOwnersGet({
        payload: {
          order_direction: 'desc',
        },
      })
    );
  }

  private _destroy$ = new Subject<null>();

  public ngOnInit(): void {
    this.store
      .pipe(
        takeUntil(this._destroy$),
        select('dataset'),
        mergeMap((data: any) => {
          this.settings = data?.data?.result;
          this.formInit();
          return this.formGroup.valueChanges;
        }),
        filter((data) => !!data)
      )
      .subscribe((data: any) => {
        console.log(data);
      });

    this.store.pipe(takeUntil(this._destroy$), select('datasetOwners')).subscribe((owners) => {
      this.owners = owners.data?.result || [];
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public formInit(): void {
    const settings = this.settings;
    console.log(settings);
    this.formGroup = this.fb.group({
      default_endpoint: settings?.default_endpoint,
      description: settings?.description,
      filter_select_enabled: settings?.filter_select_enabled ?? false,
      fetch_values_predicate: settings?.fetch_values_predicate,
      extra: settings?.extra,
      owners: [Array.isArray(settings?.owners) ? settings.owners : []],
      cache_timeout: settings?.cache_timeout,
      offset: settings?.offset ?? '',
      template_params: settings?.template_params,
    });
    console.log(this.formGroup);
  }

  public getControlByName(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public getTabActionCallback(): () => void {
    return () => {};
  }

  public checkInputFieldNumber($event): void {
    const value = Number($event.target.value);

    if (!value || value < 0) {
      $event.target.value = 0;
    }
  }

  public checkInputFieldNumberWithMinusValue($event): void {
    const value = Number($event.target.value);

    if (!value) {
      $event.target.value = 0;
    }
  }
}
