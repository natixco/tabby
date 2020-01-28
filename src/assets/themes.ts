export interface Theme {
  name: string,
  properties: any
}

export const light: Theme = {
  name: 'light',
  properties: {
    "--color-bg-one": "#FFFFFF",
    "--color-bg-two": "#F9F9F9",
    "--color-bg-three": "#C6C6C6",
    "--color-bg-card": "#FFFFFF",
    "--color-text-one": "56, 62, 83, 1",
    "--color-text-two": "114, 123, 150, 1",
    "--color-blackwhite": "0,0,0",
    "--color-card-shadow-rgb": "114, 123, 150"
  }
}

export const dark: Theme = {
  name: 'dark',
  properties: {
    "--color-bg-one": "#121212",
    "--color-bg-two": "#161616",
    "--color-bg-three": "#2B2B2B",
    "--color-bg-card": "#1E1E1E",
    "--color-text-one": "255,255,255,0.87",
    "--color-text-two": "255,255,255,0.6",
    "--color-blackwhite": "255,255,255",
    "--color-card-shadow-rgb": "transparent"
  }
}
