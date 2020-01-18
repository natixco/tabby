import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimetableComponent } from './components/pages/timetable/timetable.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { TasksComponent } from './components/pages/tasks/tasks.component';
import { NewLessonComponent } from './components/pages/new-lesson/new-lesson.component';
import { EditLessonComponent } from './components/pages/edit-lesson/edit-lesson.component';

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
    // loadChildren: '../app/components/pages/new-lesson/new-lesson.module#NewLessonModule'
  },
  {
    path: 'edit-lesson',
    component: EditLessonComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
