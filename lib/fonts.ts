import { Archivo, B612, Inter, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

// Dumpster gate page: expanded industrial display face + engineering lettering for the drawing sheet.
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

export const b612 = B612({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-b612',
});
