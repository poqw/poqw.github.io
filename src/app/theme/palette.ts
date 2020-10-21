import { PaletteOptions } from '@material-ui/core/styles/createPalette'

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    _blue: VariantColor
    _green: VariantColor
    _orange: VariantColor
    _navy: VariantColor
    _red: VariantColor
    _dark: VariantColor
    _light: VariantColor
  }

  // For typing when making styles with theme.
  // For example:
  //  const useStyles = makeStyles((theme) => ({
  //    root: {
  //      backgroundColor: theme.palette._dark['800'],
  //    }
  //  }))
  interface Palette {
    _blue: VariantColor
    _green: VariantColor
    _orange: VariantColor
    _navy: VariantColor
    _red: VariantColor
    _dark: VariantColor
    _light: VariantColor
  }
}

interface VariantColor {
  900: string
  800: string
  700: string
  600: string
  500: string
  400: string
  300: string
  100: string
  200: string
  50: string
  0: string
}

const color: PaletteOptions = {
  _blue: {
    900: '#0035F1',
    800: '#0047F3',
    700: '#0051F5',
    600: '#005BF6',
    500: '#0063F7',
    400: '#267AF8',
    300: '#4D92F9',
    200: '#80B1FB',
    100: '#B3D0FD',
    50: '#E0ECFE',
    0: '#FFFFFF'
  },
  _green: {
    900: '#070808',
    800: '#053020',
    700: '#035939',
    600: '#018252',
    500: '#00AB6B',
    400: '#2CBB85',
    300: '#59CCA0',
    200: '#86DDBA',
    100: '#B3EED5',
    50: '#E0FFF0',
    0: '#FFFFFF'
  },
  _orange: {
    900: '#FF3D04',
    800: '#FF4F08',
    700: '#FF590A',
    600: '#FF640C',
    500: '#FF6C0E',
    400: '#FF8232',
    300: '#FF9856',
    200: '#FFB687',
    100: '#FFD3B7',
    50: '#FFEDE2',
    0: '#FFFFFF'
  },
  _navy: {
    900: '#000F2B',
    800: '#00183C',
    700: '#001E45',
    600: '#00244F',
    500: '#002856',
    400: '#26486F',
    300: '#4D6989',
    200: '#8094AB',
    100: '#B3BFCC',
    50: '#E0E5EB',
    0: '#FFFFFF'
  },
  _red: {
    900: '#B71C1C',
    800: '#C62828',
    700: '#D32F2F',
    600: '#E53935',
    500: '#F44336',
    400: '#EF5350',
    300: '#E57373',
    200: '#EF9A9A',
    100: '#FFCDD2',
    50: '#FFEBEE',
    0: '#FFFFFF'
  },
  _dark: {
    900: '#080E15',
    800: '#101721',
    700: '#141D27',
    600: '#18232F',
    500: '#1B2734',
    400: '#3D4752',
    300: '#5F6871',
    200: '#8D939A',
    100: '#BBBEC2',
    50: '#E4E5E7',
    0: '#FFFFFF'
  },
  _light: {
    900: '#D1D7DD',
    800: '#D9DDE2',
    700: '#DDE0E5',
    600: '#E1E4E9',
    500: '#E4E7EB',
    400: '#E8EBEE',
    300: '#ECEEF1',
    200: '#F2F3F5',
    100: '#F7F8F9',
    50: '#FCFCFD',
    0: '#FFFFFF'
  }
}

export const palette = {
  primary: {
    main: color._light['0']
  },
  secondary: {
    main: color._green['500']
  },
  text: {
    primary: color._dark['500'],
    secondary: color._dark['400']
  },
  ...color
}
