import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/imported/sidebar/sidebar.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { TimetableComponent } from './components/pages/timetable/timetable.component';
import { TasksComponent } from './components/pages/tasks/tasks.component';
import { NewLessonComponent } from './components/pages/new-lesson/new-lesson.component';
import { EditLessonComponent } from './components/pages/edit-lesson/edit-lesson.component';
import { HoldDeleteDirective } from './directives/hold-delete.directive';
import { NewTaskComponent } from './components/pages/new-task/new-task.component';

@NgModule({
  declarations: [AppComponent, SidebarComponent, SettingsComponent, TimetableComponent, TasksComponent, NewLessonComponent, EditLessonComponent, HoldDeleteDirective, NewTaskComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}