import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TasksService} from '../../../core/services/tasks.service';
import {MockService} from '../../../core/mock/mock.service';
import {ITask} from '../../../core/interfaces/task.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-task-item-info',
  templateUrl: './task-item-info.component.html',
  styleUrls: ['./task-item-info.component.scss']
})
/**
 * Для отображения в блоке названия задачи, в вызываемом компоненте передать в сервис ид задачи.
 * Пример:
 *    tap(data => {
 *       this.tasksService.activeTaskSubject.next(this.currentTaskId);
 *     })
 * Обычно это закидывается в подписку на ид задачи через роут.
 * В будущем надо добавить возможность пробрасывать тайтл без отдельного запроса.
 */
export class TaskItemInfoComponent implements OnInit, OnDestroy{
  @Input() title: string;
  @Input() user: any;
  public task: ITask;
  private unsubscribe$ = new Subject();
  constructor(
    public tasksService: TasksService,
    public mockService: MockService
  ) { }
  ngOnInit(): void {
    this.tasksService.activeTask$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(task => {
      this.task = task;
      if (!this.user) {
        this.user = this.mockService.getUser(this.task.initiator_id);
      }
    });
  }
  ngOnDestroy(): void {
    this.tasksService.activeTaskSubject.next(null);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
