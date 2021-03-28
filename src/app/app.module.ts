import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { SettingsComponent } from '@views/settings/settings.component';
import { TimetableComponent } from '@views/timetable/timetable.component';
import { TasksComponent } from '@views/tasks/tasks.component';
import { NewLessonComponent } from '@views/new-lesson/new-lesson.component';
import { EditLessonComponent } from '@views/edit-lesson/edit-lesson.component';
import { NewTaskComponent } from '@views/new-task/new-task.component';
import { EditTaskComponent } from '@views/edit-task/edit-task.component';
import { TimetableState } from '@state/timetable/timetable.state';
import { SettingsState } from '@state/settings/settings.state';

import { HoldDeleteDirective } from '@directives/hold-delete.directive';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';

import { AppConfig } from '../environments/environment';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [AppComponent, SidebarComponent, SettingsComponent, TimetableComponent, TasksComponent, NewLessonComponent, EditLessonComponent, HoldDeleteDirective, NewTaskComponent, SafeHtmlPipe, EditTaskComponent, ButtonComponent, HeaderComponent],
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
    }),
    NgxsModule.forRoot([
      TimetableState,
      SettingsState
    ]),
    AppConfig.production ? [] : NgxsLoggerPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}