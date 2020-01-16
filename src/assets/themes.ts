export interface Theme {
  name: string,
  properties: any
}

export const light: Theme = {
  name: 'light',
  properties: {
    "--color-bg-one": "#FFF",
    "--color-bg-two": "#F9F9F9",
    "--color-text-one": "56, 62, 83, 1",
    "--color-text-two": "114, 123, 150, 1",
    "--color-accent": "#0366FC"
  }
}

export const dark: Theme = {
  name: 'dark',
  properties: {
    "--color-bg-one": "#121212",
    "--color-bg-two": "#161616",
    "--color-text-one": "255,255,255,0.87",
    "--color-text-two": "255,255,255,0.66"
  }
}
