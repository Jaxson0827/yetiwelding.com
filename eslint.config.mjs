// eslint-config-next 16 ships native flat config, so no FlatCompat shim is
// needed. The core-web-vitals entry already bundles next/typescript.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'dist/**',
      'coverage/**',
      // Vendored copy of a previous site. Not imported by the app and not
      // part of the Next.js build, so it is not linted.
      'legacypergola-site/**',
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
