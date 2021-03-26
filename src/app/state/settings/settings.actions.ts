export class SetCurrentWeek {
  static readonly type = '[settings] set current week';
  constructor(public currentWeek: string) {}
}

export class SetLanguage {
  static readonly type = '[settings] set language';
  constructor(public language: string) {}
}

export class SetDarkMode {
  static readonly type = '[settings] set dark mode';
  constructor(public isDarkMode: boolean) {}
}