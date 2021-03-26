export class SetData {
  static readonly type = '[timetable] set data';
  constructor(public weeks: any) {}
}

export class SetLessonEdit {
  static readonly type = '[timetable] set lesson edit';
  constructor(public lessonEdit: any) {}
}

export class SaveLesson {
  static readonly type = '[timetable] save new lesson';
  constructor(public lesson: any) {}
}

export class DeleteLesson {
  static readonly type = '[timetable] delete lesson';
  constructor(public lesson: any, public week: string, public day: string) {}
}

export class EditLesson {
  static readonly type = '[timetable] edit lesson';
  constructor(public originalLesson: any, public modifiedLesson: any) {}
}