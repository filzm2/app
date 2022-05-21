import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDashboardComment } from '@app/models/dashboard/dashboard.model';
import moment from 'moment';

@Component({
  selector: 'app-dashboard-comment',
  templateUrl: './dashboard-comment.component.html',
  styleUrls: ['./dashboard-comment.component.scss'],
})
export class DashboardCommentComponent implements OnInit {
  @Input() data: IDashboardComment;
  @Output() deleteCommentEvent = new EventEmitter<any>();
  @Output() editCommentEvent = new EventEmitter<any>();

  public showEditButton: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  deleteComment(id) {
    this.deleteCommentEvent.emit(id);
  }

  editComment(id) {
    this.editCommentEvent.emit(id);
  }

  momentFromNow(date) {
    let newTime = moment(date + '+00:00', 'YYYY-MM-DD HH:mm:ssZ');
    return newTime.fromNow();
  }

  showEdit() {
    this.showEditButton = true;
  }

  hideEdit() {
    this.showEditButton = false;
  }
}
