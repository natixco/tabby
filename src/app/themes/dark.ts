import { darken, lighten } from 'polished';

const COLORS = {
  accent: '#3A7B2E',
};

export const dark = {
  '--clr-accent-n': COLORS.accent,
  '--clr-accent-d': darken(0.1, COLORS.accent),
  '--clr-accent-l': lighten(0.1, COLORS.accent),
};