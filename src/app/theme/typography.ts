import { TypographyOptions } from '@material-ui/core/styles/createTypography'
import 'typeface-noto-sans-kr'

const FONT_FAMILY = ['Noto Sans KR', 'sans-serif'].join(',')

export const typography: TypographyOptions = {
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  h4: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  h5: {
    fontFamily: FONT_FAMILY,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  h6: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    textTransform: 'none'
  },
  subtitle1: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 'normal'
  },
  subtitle2: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 'normal'
  },
  body1: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 'normal'
  },
  body2: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 'normal'
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: 1.4,
    textTransform: 'none'
  },
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 'normal',
    lineHeight: 1.5,
    textTransform: 'none'
  },
  overline: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: 1.4,
    textTransform: 'uppercase'
  }
}
