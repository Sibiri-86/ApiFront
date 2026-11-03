import { Component, OnDestroy } from '@angular/core';
import { Task } from 'src/app/demo/api/task';
import { TaskService } from './service/task.service';
import { Subscription } from 'rxjs';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    templateUrl: './tasklist.app.component.html',
    standalone: true,
    imports: [ButtonModule, RippleModule, TaskListComponent, CreateTaskComponent]
})
export class TaskListAppComponent implements OnDestroy {

    subscription: Subscription;

    todo: Task[] = [];

    completed: Task[] = [];

    constructor(private taskService: TaskService) {
        this.subscription = this.taskService.taskSource$.subscribe(data => this.categorize(data));
    }

    categorize(tasks: Task[]) {
        this.todo = tasks.filter(t => t.completed !== true);
        this.completed = tasks.filter(t => t.completed);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.taskService.showDialog('Create Task', true);
    }
}