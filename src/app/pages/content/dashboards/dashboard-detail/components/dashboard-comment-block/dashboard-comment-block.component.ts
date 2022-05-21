import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DashboardChartCommentsDelete,
  DashboardChartCommentsGet,
  DashboardChartCommentsPost,
  DashboardChartCommentsPut,
  DashboardCommentsClear,
} from '@app/store/actions/dashboard/dashboard-comments.actions';

import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IDashboardComment } from '@app/models/dashboard/dashboard.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// status: может быть 1, 2, 3 (коммент, вопрос, восклицание)
// 'comments_id': record.id,
// 'user': {
//   'id': record.user.id,
//   'fio': ' '.join([record.user.first_name, record.user.last_name])
// },
// 'date': str(record.changed_on) if record.changed_on else str(record.craeated_on),
// 'comment': record.comment,
// 'status': record.status

@Component({
  selector: 'app-dashboard-comment-block',
  templateUrl: './dashboard-comment-block.component.html',
  styleUrls: ['./dashboard-comment-block.component.scss'],
})
export class DashboardCommentBlockComponent implements OnInit {
  @Input() dashboardId: number;
  @Input() chartId: number;

  @Output() changeCommentStateEvent = new EventEmitter<any>();

  private _destroy$ = new Subject<null>();
  public commentData: Array<IDashboardComment> = [];
  public addComment: boolean = false;
  public statusChecked: number = 1;
  public editCommentId: number = -1;
  public loading = true;

  public commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
    status: new FormControl(1),
  });
  public commentTextarea = new FormControl('');
  constructor(private store: Store<appState.State>) {}

  ngOnInit(): void {
    this.initForm();
    this.store.dispatch(
      DashboardChartCommentsGet({
        dashboardId: this.dashboardId,
        chartId: this.chartId,
      })
    );

    this.store.pipe(takeUntil(this._destroy$), select('dashboardComments')).subscribe((res) => {
      if (res.data) {
        this.commentData = res.data.result;
        this.loading = false;
      }
      if (res.status) {
        this.store.dispatch(
          DashboardChartCommentsGet({
            dashboardId: this.dashboardId,
            chartId: this.chartId,
          })
        );
        this.changeCommentStateEvent.emit();
      }
    });
  }

  private initForm() {
    this.commentForm.setValue({
      comment: '',
      status: 1,
    });
  }

  onAddCommentClick() {
    this.addComment = !this.addComment;
  }

  onSaveCommentClick() {
    let commentFormData = new FormData();
    commentFormData.append('comment', this.commentForm.get('comment').value);
    commentFormData.append('status', this.commentForm.get('status').value.toString());
    this.store.dispatch(
      DashboardChartCommentsPost({
        dashboardId: this.dashboardId,
        chartId: this.chartId,
        payload: commentFormData,
      })
    );
    this.commentForm.setValue({
      comment: '',
      status: 1,
    });
  }

  //on radio status change
  checkStatus(status) {
    this.commentForm.patchValue({
      status: status,
    });

    this.statusChecked = Number(status);
  }

  deleteComment(event) {
    let deleteFormData = new FormData();
    deleteFormData.append('comment_id', event.toString());

    this.store.dispatch(
      DashboardChartCommentsDelete({
        dashboardId: this.dashboardId,
        chartId: this.chartId,
        payload: deleteFormData,
      })
    );
  }

  openEditComment(event) {
    let commentText = this.commentData.find((element) => {
      return element.comments_id === event;
    }).comment;
    let commentStatus = this.commentData.find((element) => {
      return element.comments_id === event;
    }).status;

    this.statusChecked = commentStatus;
    this.commentForm.setValue({
      comment: commentText,
      status: Number(commentStatus),
    });

    this.editCommentId = event;
  }

  onUpdateCommentClick() {
    let commentFormData = new FormData();
    commentFormData.append('comment_id', this.editCommentId.toString());
    commentFormData.append('comment', this.commentForm.get('comment').value);
    commentFormData.append('status', this.commentForm.get('status').value.toString());
    this.store.dispatch(
      DashboardChartCommentsPut({
        dashboardId: this.dashboardId,
        chartId: this.chartId,
        payload: commentFormData,
      })
    );
    this.commentForm.setValue({
      comment: '',
      status: 1,
    });
    this.editCommentId = -1;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(DashboardCommentsClear());
  }
}
