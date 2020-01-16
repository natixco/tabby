import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NewLessonComponent } from './new-lesson.component';

const routes: Routes = [
  { path: "", component: NewLessonComponent},
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [NewLessonComponent]
})
export class NewLessonModule {}