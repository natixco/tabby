import { darken, rgba } from 'polished';

const COLORS = {
  accent: '#1F78FE',
  danger: '#FE4A49',
  textOne: '#383E53',
  textTwo: '#727B96',
};

export const light = {
  '--clr-accent-n': COLORS.accent,
  '--clr-accent-d': darken(0.1, COLORS.accent),
  '--clr-accent-l': rgba(COLORS.accent, 0.1),
  '--clr-danger-n': COLORS.danger,
  '--clr-danger-d': darken(0.1, COLORS.danger),
  '--clr-danger-l': rgba(COLORS.danger, 0.1),
  '--clr-text-one': COLORS.textOne,
  '--clr-text-two': COLORS.textTwo,
  '--clr-text-two-l': rgba(COLORS.textTwo, 0.1),
};