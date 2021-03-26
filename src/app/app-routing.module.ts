import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimetableComponent } from '@views/timetable/timetable.component';
import { SettingsComponent } from '@views/settings/settings.component';
import { TasksComponent } from '@views/tasks/tasks.component';
import { NewLessonComponent } from '@views/new-lesson/new-lesson.component';
import { EditLessonComponent } from '@views/edit-lesson/edit-lesson.component';
import { NewTaskComponent } from '@views/new-task/new-task.component';
import { EditTaskComponent } from '@views/edit-task/edit-task.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'timetable',
    pathMatch: 'full'
  },
  {
    path: 'timetable',
    component: TimetableComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'new-lesson',
    component: NewLessonComponent
  },
  {
    path: 'edit-lesson',
    component: EditLessonComponent
  },
  {
    path: 'new-task',
    component: NewTaskComponent
  },
  {
    path: 'edit-task',
    component: EditTaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
